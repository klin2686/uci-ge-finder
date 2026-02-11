import os
from pathlib import Path
from typing import Any

import redis
from dotenv import load_dotenv

basedir = Path(__file__).parent.parent
load_dotenv(basedir / '.env', override=True)


class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379')

    CACHE_TYPE = os.environ.get('CACHE_TYPE', 'RedisCache')
    CACHE_DEFAULT_TIMEOUT = int(os.environ.get('CACHE_DEFAULT_TIMEOUT', 300))
    if CACHE_TYPE == 'RedisCache':
        _cache_redis_url = f'{REDIS_URL}/0'
        _ssl_options: dict[str, Any] = {}
        if _cache_redis_url.startswith('rediss://'):
            _ssl_options = {'ssl_cert_reqs': None}
        CACHE_REDIS_HOST = redis.from_url(_cache_redis_url, **_ssl_options)

    RATELIMIT_STORAGE_URI = f'{REDIS_URL}/1'
    RATELIMIT_STORAGE_OPTIONS: dict[str, Any] = {'socket_connect_timeout': 5}
    if RATELIMIT_STORAGE_URI.startswith('rediss://'):
        RATELIMIT_STORAGE_OPTIONS['ssl_cert_reqs'] = None
    RATELIMIT_STRATEGY = os.environ.get('RATELIMIT_STRATEGY', "fixed-window")


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
