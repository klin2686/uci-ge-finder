from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .courses_service import courses_service
from .routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await courses_service.start()
    yield
    await courses_service.close()


if settings.ENVIRONMENT.lower().strip() == 'production':
    documentation_args: dict[str, Any] = {
        'openapi_url': None,
        'docs_url': None,
        'redoc_url': None,
    }
else:
    documentation_args: dict[str, Any] = {
        'openapi_url': '/api/openapi.json',
        'docs_url': '/api/docs',
        'redoc_url': '/api/redoc',
    }

app = FastAPI(lifespan=lifespan, **documentation_args)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(router)
