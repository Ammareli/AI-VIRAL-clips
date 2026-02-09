from pydantic_settings import BaseSettings
from app.utils.logger import log_info




class Settings(BaseSettings):
    redis_host: str = 'localhost'
    redis_port: int = 6379
    redis_db: int = 0
    redis_decode_responses: bool = True
    resolution: str = "720p"

    class Config:
        log_info("Loading configuration from .env file")
        env_file = ".env"

settings = Settings()


