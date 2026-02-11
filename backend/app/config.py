from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_dotenv_path = Path(__file__).parent.parent / '.env'


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=_dotenv_path, env_ignore_empty=True, extra='ignore')

    ANTEATER_API_KEY: str


settings = Settings()  # type: ignore[call-arg]
