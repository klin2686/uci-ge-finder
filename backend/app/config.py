import os
import ssl
from pathlib import Path

from dotenv import load_dotenv

basedir = Path(__file__).parent.parent
load_dotenv(basedir / '.env')


class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

    REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379')

    _is_rediss = REDIS_URL.startswith('rediss')

    CACHE_TYPE = os.environ.get('CACHE_TYPE', 'RedisCache')
    CACHE_DEFAULT_TIMEOUT = int(os.environ.get('CACHE_DEFAULT_TIMEOUT', 300))
    CACHE_REDIS_URL = f'{REDIS_URL}/0' if CACHE_TYPE == 'RedisCache' else None

    RATELIMIT_STORAGE_URI = f'{REDIS_URL}/1'
    RATELIMIT_STORAGE_OPTIONS = {'socket_connect_timeout': 5}

    if _is_rediss:
        RATELIMIT_STORAGE_OPTIONS['ssl_cert_reqs'] = ssl.CERT_NONE
        # Create SSL context for Flask-Caching
        _ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        _ssl_context.check_hostname = False
        _ssl_context.verify_mode = ssl.CERT_NONE
        CACHE_OPTIONS = {'ssl': _ssl_context}

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
