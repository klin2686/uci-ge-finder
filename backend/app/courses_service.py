from urllib.parse import urlparse

from aiocache import RedisCache
from aiocache.serializers import PickleSerializer
from httpx import AsyncClient, HTTPStatusError, RequestError, TimeoutException

from .config import settings


class CoursesService:
    GE_FULL_NAME_TO_ROMAN = {
        'GE Ia: Lower Division Writing': 'Ia',
        'GE Ib: Upper Division Writing': 'Ib',
        'GE II: Science and Technology': 'II',
        'GE III: Social & Behavioral Sciences': 'III',
        'GE IV: Arts and Humanities': 'IV',
        'GE Va: Quantitative Literacy': 'Va',
        'GE Vb: Formal Reasoning': 'Vb',
        'GE VI: Language Other Than English': 'VI',
        'GE VII: Multicultural Studies': 'VII',
        'GE VIII: International/Global Issues': 'VIII',
    }

    PARAMETER_GE_CATEGORIES = {
        'GE-1A',
        'GE-1B',
        'GE-2',
        'GE-3',
        'GE-4',
        'GE-5A',
        'GE-5B',
        'GE-6',
        'GE-7',
        'GE-8',
    }

    def __init__(self):
        self._client: AsyncClient | None = None
        self._cache: RedisCache | None = None

    async def start(self):
        self._client = AsyncClient(
            headers={'Accept-Encoding': '', 'Authorization': f'Bearer {settings.ANTEATER_API_KEY}'},
        )

        parsed = urlparse(settings.REDIS_URL)
        use_ssl = parsed.scheme == 'rediss'

        cache_config = {
            'endpoint': parsed.hostname or 'localhost',
            'port': parsed.port or 6379,
            'serializer': PickleSerializer(),
        }

        if parsed.password:
            cache_config['password'] = parsed.password

        if use_ssl:
            cache_config['ssl'] = True
            cache_config['connection_pool_kwargs'] = {'ssl_cert_reqs': None}

        cache = RedisCache(**cache_config)

        try:
            test_key = '__cache_health_check__'
            await cache.set(test_key, 'ok', ttl=5)
            result = await cache.get(test_key)
            if result != 'ok':
                raise RuntimeError('Cache read/write test failed.')
            await cache.delete(test_key)
        except Exception as e:
            await cache.close()
            raise RuntimeError(f'Failed to connect to Redis at {settings.REDIS_URL}: {e}') from e

        self._cache = cache

    async def close(self):
        if self._client is not None:
            await self._client.aclose()
        if self._cache is not None:
            await self._cache.close()

    async def fetch_category_ge_courses(self, ge_category):
        if self._cache is None:
            raise RuntimeError('CoursesService has not been started. Call start() before using the service.')
        cache_key = f'courses:category:{ge_category}'
        cached_result = await self._cache.get(cache_key)
        if cached_result is not None:
            return cached_result

        if self._client is None:
            raise RuntimeError('CoursesService has not been started. Call start() before using the service.')
        category_ge_courses = []
        cursor = None
        while True:
            params = {'geCategory': ge_category, 'cursor': cursor}
            try:
                response = await self._client.get(
                    'https://anteaterapi.com/v2/rest/coursesCursor',
                    params=params,
                    timeout=5,
                )
                response.raise_for_status()
                data = response.json()['data']
                category_ge_courses.extend(
                    self._extract_course_fields(c) for c in data['items'] if self._is_current_course(c)
                )
                cursor = data['nextCursor']
            except TimeoutException as e:
                raise RuntimeError(f'Request to AnteaterAPI timed out while fetching {ge_category} courses') from e
            except (RequestError, HTTPStatusError) as e:
                raise RuntimeError(f'Failed to fetch courses from AnteaterAPI: {e}') from e
            except (KeyError, IndexError, ValueError) as e:
                raise RuntimeError(f'Invalid response format from AnteaterAPI: {e}')
            if cursor is None:
                break

        await self._cache.set(cache_key, category_ge_courses, ttl=settings.CACHE_TTL_SECONDS)

        return category_ge_courses

    async def fetch_all_ge_courses(self):
        sorted_ge_categories = sorted(self.PARAMETER_GE_CATEGORIES)
        seen_codes = set()
        all_courses = []

        for category in sorted_ge_categories:
            category_courses = await self.fetch_category_ge_courses(category)
            for course in category_courses:
                if course['course_code'] not in seen_codes:
                    seen_codes.add(course['course_code'])
                    all_courses.append(course)

        return all_courses

    async def fetch_intersection_courses(self, category1, category2):
        category1_courses = await self.fetch_category_ge_courses(category1)
        category1_codes = {c['course_code'] for c in category1_courses}

        category2_courses = await self.fetch_category_ge_courses(category2)
        intersection_courses = [c for c in category2_courses if c['course_code'] in category1_codes]

        return intersection_courses

    @staticmethod
    def _extract_course_fields(course):
        return {
            'course_code': f'{course["department"]} {course["courseNumber"]}',
            'course_title': course['title'],
            'units': course['maxUnits'],
            'ge_categories': {
                CoursesService.GE_FULL_NAME_TO_ROMAN[category.strip()]
                for category in course['geList']
                if category.strip() in CoursesService.GE_FULL_NAME_TO_ROMAN
            },
            'description': course['description'],
        }

    @staticmethod
    def _is_current_course(course):
        terms = course.get('terms', [])
        current_years = {'2024', '2025', '2026'}
        for term in terms:
            if term.strip()[:4] in current_years:
                return True
        return False


courses_service = CoursesService()
