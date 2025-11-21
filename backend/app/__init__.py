import os
import ssl

import redis
from flask import Flask

from app.config import config
from app.extensions import cache, cors, limiter


def create_app(config_name=None):
    """Application factory pattern for Flask app creation"""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    cors.init_app(app)
    cache.init_app(app)
    limiter.init_app(app)

    from app import extensions
    redis_url = app.config['CACHE_REDIS_URL']
    ssl_options = {}
    if redis_url and redis_url.startswith('rediss://'):
        ssl_options = {"ssl_cert_reqs": ssl.CERT_NONE}
    extensions.redis_client = redis.from_url(
        redis_url,
        decode_responses=True,
        **ssl_options
    )

    from app.routes import register_blueprints
    register_blueprints(app)

    return app