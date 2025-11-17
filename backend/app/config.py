import os
from pathlib import Path

from dotenv import load_dotenv

basedir = Path(__file__).parent.parent
load_dotenv(basedir / '.env')


class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    CACHE_TYPE = os.environ.get('CACHE_TYPE', 'RedisCache')
    CACHE_DEFAULT_TIMEOUT = int(os.environ.get('CACHE_DEFAULT_TIMEOUT', 300))
    CACHE_REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    CACHE_TYPE = 'NullCache'


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
