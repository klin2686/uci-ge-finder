import os

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
    extensions.redis_client = app.config.get('CACHE_REDIS_HOST')

    from app.routes import register_blueprints
    register_blueprints(app)

    return app