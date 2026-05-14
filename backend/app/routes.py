from fastapi import APIRouter, HTTPException, status

from .courses_service import ParameterGECategories, courses_service
from .schemas import CourseList

router = APIRouter(prefix='/api')


@router.get('/health')
async def check_health():
    return {'status': 'healthy'}


@router.get('/ge-courses', response_model=CourseList)
async def get_ge_courses(
    category1: ParameterGECategories | None = None, category2: ParameterGECategories | None = None
):
    try:
        if category1 and category2:
            if category1 == category2:
                category_courses = await courses_service.fetch_category_ge_courses(category1)
                return {'courses': category_courses}
            else:
                intersection_courses = await courses_service.fetch_intersection_courses(category1, category2)
                return {'courses': intersection_courses}
        elif category1 or category2:
            category_courses = await courses_service.fetch_category_ge_courses(category1 or category2)  # type: ignore
            return {'courses': category_courses}
        else:
            all_ge_courses = await courses_service.fetch_all_ge_courses()
            return {'courses': all_ge_courses}
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail='An error occured while fetching data from Anteater API.',
        ) from e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='An unexpected error has occurred.',
        ) from e
