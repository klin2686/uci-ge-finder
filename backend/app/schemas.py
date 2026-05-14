from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


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
    ge_categories: list[str]
    description: str
    prerequisites: str
    restrictions: str


class CourseList(ToCamelBaseModel):
    courses: list[Course]
