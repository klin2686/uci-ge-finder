import os

import redis
from flask import Flask

from app.config import config
from app.extensions import cache, cors


def create_app(config_name=None):
    """Application factory pattern for Flask app creation"""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize extensions
    cors.init_app(app)
    cache.init_app(app)

    # Initialize Redis client
    from app import extensions
    extensions.redis_client = redis.from_url(
        app.config['CACHE_REDIS_URL'],
        decode_responses=True
    )

    # Register blueprints
    from app.routes import register_blueprints
    register_blueprints(app)

    return app