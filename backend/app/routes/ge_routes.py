import requests
from flask import Blueprint, jsonify, request
from requests.exceptions import RequestException, Timeout

from app.extensions import cache, redis_client

ge_bp = Blueprint('ge', __name__)


VALID_GE_CATEGORIES = {
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


def _format_course(course):
    """Helper to format a course object"""
    def format_ge_categories(ge_text):
        if not ge_text.strip():
            return ''
        ge_text = ge_text.strip()
        if ge_text.startswith('('):
            ge_text = ge_text[1:]
        if ge_text.endswith('.'):
            ge_text = ge_text[:-1]
        if ge_text.endswith(')'):
            ge_text = ge_text[:-1]
        return ge_text

    return {
        'courseCode': course['id'],
        'courseTitle': course['title'],
        'geCategories': format_ge_categories(course['geText']),
        'description': course['description'],
    }


def _delete_associated_intersection_caches(ge_category):
    """Endpoint to clear all cached intersection calculations for a given GE category"""
    pattern = f'flask_cache_all_ge_intersection_*{ge_category}*'

    if redis_client is None:
        raise RuntimeError('Redis client not initialized')

    for key in redis_client.scan_iter(match=pattern):
        redis_client.delete(key)


@cache.memoize(timeout=604800)  # 7 days
def _fetch_all_category_ge_courses(ge_category):
    """Fetch all courses (formatted) for a GE category using cursor pagination; pass 'ALL' to fetch all GE categories"""
    if ge_category == 'ALL':
        sorted_ge_categories = sorted(VALID_GE_CATEGORIES)
        seen_codes = set()
        all_courses = []
        for category in sorted_ge_categories:
            category_courses = _fetch_all_category_ge_courses(category)
            for course in category_courses:
                if course['courseCode'] not in seen_codes:
                    seen_codes.add(course['courseCode'])
                    all_courses.append(course)
        return all_courses

    all_category_courses = []
    cursor = None
    while True:
        params = {'geCategory': ge_category, 'cursor': cursor}

        try:
            response = requests.get(
                'https://anteaterapi.com/v2/rest/coursesCursor',
                params=params,
                headers={'Accept-Encoding': ''},
                timeout=5,
            )
            response.raise_for_status()
            data = response.json()['data']
        except Timeout:
            raise RuntimeError(
                f'Request to AnteaterAPI timed out while fetching {ge_category} courses'
            )
        except RequestException as e:
            raise RuntimeError(f'Failed to fetch courses from AnteaterAPI: {str(e)}')
        except (KeyError, ValueError) as e:
            raise RuntimeError(f'Invalid response format from AnteaterAPI: {str(e)}')

        all_category_courses.extend(data['items'])

        cursor = data.get('nextCursor')
        if not cursor:
            break

    formatted_category_courses = [_format_course(c) for c in all_category_courses]

    # if any single category is updated, delete cache for All
    cache.delete_memoized(_fetch_all_category_ge_courses, 'ALL')

    # if any single category is updated, dete intersection calculation caches involving it
    _delete_associated_intersection_caches(ge_category)

    return formatted_category_courses


def _make_intersection_cache_key(*args, **kwargs):
    """Generate consistent cache key for intersection regardless of filter order"""
    if len(args) == 2:
        filter1 = args[0]
        filter2 = args[1]
        sorted_filters = tuple(sorted((filter1, filter2)))
    else:
        filter1 = kwargs['filter1']
        filter2 = kwargs['filter2']
        sorted_filters = tuple(sorted((filter1, filter2)))
    return f'all_ge_intersection_{sorted_filters[0]}_{sorted_filters[1]}'


@cache.cached(timeout=604800, make_cache_key=_make_intersection_cache_key)  # 7 days
def _get_all_ge_intersection(filter1, filter2):
    """Fetch all courses (formatted) that satisfy both GE categories, cached regardless of filter order"""
    filter1_courses = _fetch_all_category_ge_courses(filter1)
    filter1_codes = {c['courseCode'] for c in filter1_courses}

    filter2_courses = _fetch_all_category_ge_courses(filter2)
    intersection_courses = [
        c for c in filter2_courses if c['courseCode'] in filter1_codes
    ]

    return intersection_courses


def _get_courses_by_cursor(formatted_courses, cursor=None, take=100):
    """Get a subset of courses based on cursor"""

    if not cursor:
        start_index = 0
    else:
        start_index = None
        for i, course in enumerate(formatted_courses):
            if course['courseCode'] == cursor:
                start_index = i
                break

        if start_index is None:
            raise ValueError(f'Invalid cursor: {cursor} not found in results')

    end_index = start_index + take
    courses_page = formatted_courses[start_index:end_index]

    next_cursor = None
    if end_index < len(formatted_courses):
        next_cursor = formatted_courses[end_index]['courseCode']

    return courses_page, next_cursor


@ge_bp.route('/ge-courses', methods=['GET'])
def get_ge_courses():
    """Get courses that satisfy one or multiple GE categories with pagination; if no filters, return all GE courses"""

    filter1 = request.args.get('filter1', '').strip().upper() or None
    filter2 = request.args.get('filter2', '').strip().upper() or None
    cursor = request.args.get('cursor', None)
    take = request.args.get('take', 100, type=int)

    if take <= 0 or take > 100:
        return jsonify({'error': 'Invalid take value. Must be between 1 and 100.'}), 400

    if filter1 and filter1 not in VALID_GE_CATEGORIES and filter1 != 'ALL':
        return jsonify({'error': f'Invalid filter1 value: {filter1}'}), 400
    if filter2 and filter2 not in VALID_GE_CATEGORIES and filter2 != 'ALL':
        return jsonify({'error': f'Invalid filter2 value: {filter2}'}), 400

    try:
        if filter1 and filter2:
            intersection_courses = _get_all_ge_intersection(filter1, filter2)
            courses, next_cursor = _get_courses_by_cursor(
                intersection_courses, cursor, take
            )
            return jsonify({'courses': courses, 'nextCursor': next_cursor}), 200
        elif filter1 or filter2:
            category_courses = _fetch_all_category_ge_courses(filter1 or filter2)
            courses, next_cursor = _get_courses_by_cursor(
                category_courses, cursor, take
            )
            return jsonify({'courses': courses, 'nextCursor': next_cursor}), 200
        else:
            all_ge_courses = _fetch_all_category_ge_courses('ALL')
            courses, next_cursor = _get_courses_by_cursor(all_ge_courses, cursor, take)
            return jsonify({'courses': courses, 'nextCursor': next_cursor}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except RuntimeError as e:
        return jsonify({'error': str(e)}), 503
    except Exception:
        return jsonify({'error': 'An unexpected error occurred'}), 500


@ge_bp.route('/clear-cache', methods=['POST'])
def clear_cache():
    """Clear cache (development only)"""
    from flask import current_app

    if not current_app.debug:
        return jsonify({'error': 'This endpoint is only available in development mode'}), 403

    category = request.args.get('category', None)

    if category:
        _delete_associated_intersection_caches(category)
        cache.delete_memoized(_fetch_all_category_ge_courses, category)
        return jsonify({'message': f'Cache cleared for {category}'}), 200
    else:
        cache.clear()
        return jsonify({'message': 'All caches cleared'}), 200