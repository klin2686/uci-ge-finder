import asyncio
from collections import defaultdict
from enum import StrEnum
from urllib.parse import urlparse

from aiocache import RedisCache
from aiocache.serializers import JsonSerializer
from httpx import AsyncClient, HTTPStatusError, RequestError, TimeoutException

from .config import settings


class ParameterGECategories(StrEnum):
    GE_1A = 'GE-1A'
    GE_1B = 'GE-1B'
    GE_2 = 'GE-2'
    GE_3 = 'GE-3'
    GE_4 = 'GE-4'
    GE_5A = 'GE-5A'
    GE_5B = 'GE-5B'
    GE_6 = 'GE-6'
    GE_7 = 'GE-7'
    GE_8 = 'GE-8'


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

    GE_SORT_ORDER: dict[str, int] = {v: i for i, v in enumerate(GE_FULL_NAME_TO_ROMAN.values())}

    INCLUDED_YEARS = {
        '2025',
        '2026',
        '2027',
    }

    def __init__(self):
        self._client: AsyncClient | None = None
        self._cache: RedisCache | None = None
        self._fetch_locks: defaultdict[str, asyncio.Lock] = defaultdict(asyncio.Lock)

    async def start(self):
        self._client = AsyncClient(
            headers={'Accept-Encoding': '', 'Authorization': f'Bearer {settings.ANTEATER_API_KEY}'},
        )

        parsed = urlparse(settings.REDIS_URL)
        use_ssl = parsed.scheme == 'rediss'

        cache_config = {
            'endpoint': parsed.hostname or 'localhost',
            'port': parsed.port or 6379,
            'serializer': JsonSerializer(),
            'pool_max_size': 10,
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

    async def fetch_category_ge_courses(self, ge_category: ParameterGECategories):
        if self._cache is None or self._client is None:
            raise RuntimeError('CoursesService has not been started. Call start() before using the service.')
        cache_key = f'courses:category:{ge_category}'
        cached_result = await self._cache.get(cache_key)
        if cached_result is not None:
            return cached_result

        async with self._fetch_locks[ge_category]:
            cached_result = await self._cache.get(cache_key)
            if cached_result is not None:
                return cached_result

            category_ge_courses = []
            cursor = None
            while True:
                params = {'geCategory': ge_category.value, 'cursor': cursor}
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
        results = await asyncio.gather(*(self.fetch_category_ge_courses(cat) for cat in ParameterGECategories))
        seen_codes: set[str] = set()
        all_courses = []
        for category_courses in results:
            for course in category_courses:
                if course['course_code'] not in seen_codes:
                    seen_codes.add(course['course_code'])
                    all_courses.append(course)
        return all_courses

    async def fetch_intersection_courses(self, category1: ParameterGECategories, category2: ParameterGECategories):
        category1_courses, category2_courses = await asyncio.gather(
            self.fetch_category_ge_courses(category1),
            self.fetch_category_ge_courses(category2),
        )
        category1_codes = {c['course_code'] for c in category1_courses}
        return [c for c in category2_courses if c['course_code'] in category1_codes]

    @staticmethod
    def _extract_course_fields(course):
        def create_sorted_ge_list(ge_list: list[str]):
            result = [
                CoursesService.GE_FULL_NAME_TO_ROMAN[cat]
                for category in ge_list
                if (cat := category.strip()) in CoursesService.GE_FULL_NAME_TO_ROMAN
            ]
            result.sort(key=lambda c: CoursesService.GE_SORT_ORDER[c])
            return result

        return {
            'course_code': f'{course["department"]} {course["courseNumber"]}',
            'course_title': course['title'],
            'units': course['maxUnits'],
            'ge_categories': create_sorted_ge_list(course['geList']),
            'description': course['description'],
            'prerequisites': course['prerequisiteText'],
            'restrictions': course['restriction'],
        }

    @staticmethod
    def _is_current_course(course):
        return any(term.strip()[:4] in CoursesService.INCLUDED_YEARS for term in course.get('terms', []))


courses_service = CoursesService()
