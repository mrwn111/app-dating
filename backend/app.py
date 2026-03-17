import os
from dotenv import load_dotenv
from flask import Flask
from flask_login import LoginManager
from config import DevelopmentConfig
from models import db, User

load_dotenv()

def create_app(config_name='development'):
    app = Flask(__name__)
    
    # Configuration
    if config_name == 'development':
        app.config.from_object(DevelopmentConfig)
    else:
        from config import ProductionConfig
        app.config.from_object(ProductionConfig)
    
    # Initialiser les extensions
    db.init_app(app)
    
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Veuillez vous connecter.'
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Context processor
    with app.app_context():
        db.create_all()
    
    # Blueprints (à créer dans routes/)
    from routes.auth import auth_bp
    from routes.profile import profile_bp
    from routes.discover import discover_bp
    from routes.matches import matches_bp
    from routes.messages import messages_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(profile_bp, url_prefix='/profile')
    app.register_blueprint(discover_bp, url_prefix='/discover')
    app.register_blueprint(matches_bp, url_prefix='/matches')
    app.register_blueprint(messages_bp, url_prefix='/messages')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
