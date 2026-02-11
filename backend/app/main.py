from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .courses_service import courses_service
from .config import settings
from .routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await courses_service.start()
    yield
    await courses_service.close()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(router)
