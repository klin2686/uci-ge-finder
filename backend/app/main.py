from contextlib import asynccontextmanager

from fastapi import FastAPI

from .courses_service import courses_service
from .routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    courses_service.start()
    yield
    await courses_service.close()


app = FastAPI(lifespan=lifespan)

app.include_router(router)
