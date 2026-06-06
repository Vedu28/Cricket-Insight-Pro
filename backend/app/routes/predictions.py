from flask import Blueprint, request, jsonify
from app.database import get_db
from app.ml.ml_engine import MLEngine

predictions_bp = Blueprint('predictions', __name__)

@predictions_bp.route('', methods=['GET'])
def get_prediction():
    player_id = request.args.get('player_id')
    algorithm = request.args.get('algorithm', 'linear_regression')
    
    if not player_id:
        return jsonify({"message": "player_id parameter is required!"}), 400
        
    db = get_db()
    player = db["players"].find_one({"_id": player_id})
    if not player:
        return jsonify({"message": "Player not found!"}), 404
        
    try:
        prediction_result = MLEngine.predict_next_match(player_id, algorithm)
        return jsonify({
            "player_id": player_id,
            "player_name": player.get("name"),
            "algorithm": algorithm,
            "predictions": prediction_result
        }), 200
    except Exception as e:
        return jsonify({"message": f"Prediction failed: {str(e)}"}), 500
