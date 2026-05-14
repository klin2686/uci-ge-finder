from pydantic import BaseModel, ConfigDict, field_serializer
from pydantic.alias_generators import to_camel

SORTED_GE_CATEGORIES = {
    'Ia': 1,
    'Ib': 2,
    'II': 3,
    'III': 4,
    'IV': 5,
    'Va': 6,
    'Vb': 7,
    'VI': 8,
    'VII': 9,
    'VIII': 10,
}


class ToCamelBaseModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        validate_by_name=True,
        validate_by_alias=False,
        serialize_by_alias=True,
    )


class Course(ToCamelBaseModel):
    course_code: str
    course_title: str
    units: int | float
    ge_categories: set[str]
    description: str
    prerequisites: str
    restrictions: str

    @field_serializer('ge_categories', mode='plain')
    def convert_ge_categories_to_string(self, ge_categories: set[str]) -> str:
        return ', '.join(category for category in sorted(ge_categories, key=lambda c: SORTED_GE_CATEGORIES[c]))


class CourseList(ToCamelBaseModel):
    courses: list[Course]
