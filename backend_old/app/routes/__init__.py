from app.routes.ge_routes import ge_bp
from app.routes.health_routes import health_bp


def register_blueprints(app):
    """Register all blueprints with the Flask app"""
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(ge_bp, url_prefix='/api')
