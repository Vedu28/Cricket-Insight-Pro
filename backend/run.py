import os
from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.database import get_db, is_mock_db
from app.data.seed import seed_database

# Import blueprints
from app.routes.auth import auth_bp
from app.routes.players import players_bp
from app.routes.matches import matches_bp
from app.routes.predictions import predictions_bp
from app.routes.insights import insights_bp
from app.routes.scouting import scouting_bp

def create_app():
    app = Flask(__name__)
    
    # Configure CORS - allow React frontend (default Vite port is 5173 or 3000)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(players_bp, url_prefix='/api/players')
    app.register_blueprint(matches_bp, url_prefix='/api/matches')
    app.register_blueprint(predictions_bp, url_prefix='/api/predictions')
    app.register_blueprint(insights_bp, url_prefix='/api/insights')
    app.register_blueprint(scouting_bp, url_prefix='/api/scouting')
    
    @app.route('/api/status', methods=['GET'])
    def status():
        db_type = "Mock JSON DB (Local Fallback)" if is_mock_db else "Real MongoDB Connection"
        return jsonify({
            "status": "online",
            "message": "Cricket-Insight-Pro Backend Server is running.",
            "database_system": db_type
        }), 200
        
    # Seed database if player count is zero
    try:
        db = get_db()
        player_count = db["players"].count_documents({})

        if player_count == 0:
            print("[Startup] Database is empty. Running automatic seed data generator...")
            seed_database()
        else:
            print(f"[Startup] Found {player_count} players. Skipping seed step.")
    except Exception as e:
        print(f"[Startup] Seeding check failed: {e}")
        
    return app

if __name__ == '__main__':
    app = create_app()
    print(f"Starting Flask backend server on http://{Config.HOST}:{Config.PORT} (Debug={Config.DEBUG})...")
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
