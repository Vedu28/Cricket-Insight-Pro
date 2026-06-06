import csv
import io
import json
import datetime
from flask import Blueprint, request, jsonify, g
from app.database import get_db
from app.routes.auth import token_required, role_required

matches_bp = Blueprint('matches', __name__)

@matches_bp.route('', methods=['GET'])
def get_matches():
    db = get_db()
    matches_list = db["matches"].find()
    result = []
    for m in matches_list:
        m_copy = dict(m)
        m_copy["_id"] = str(m_copy["_id"])
        result.append(m_copy)
    return jsonify(result), 200

@matches_bp.route('/<match_id>', methods=['GET'])
def get_match_by_id(match_id):
    db = get_db()
    match = db["matches"].find_one({"match_id": match_id})
    if not match:
        return jsonify({"message": "Match not found!"}), 404
        
    m_copy = dict(match)
    m_copy["_id"] = str(m_copy["_id"])
    
    # Calculate match highlights/insights dynamically
    # Look up player logs for this match if they exist
    logs = db["match_logs"].find({"match_id": match_id})
    
    best_batter = None
    best_batsman_runs = -1
    best_bowler = None
    best_bowler_wkts = -1
    best_bowler_runs = 999
    
    impact_player = None
    max_impact = -1
    
    for log in logs:
        p_id = log.get("player_id")
        player = db["players"].find_one({"_id": p_id})
        p_name = player.get("name", "Unknown Player") if player else "Unknown Player"
        
        runs = int(log.get("batting", {}).get("runs_scored", 0))
        wkts = int(log.get("bowling", {}).get("wickets_taken", 0))
        econ = float(log.get("bowling", {}).get("economy_rate", 0.0))
        
        # Best batter check
        if runs > best_batsman_runs:
            best_batsman_runs = runs
            best_batter = f"{p_name} ({runs} runs)"
            
        # Best bowler check
        if wkts > best_bowler_wkts:
            best_bowler_wkts = wkts
            best_bowler_runs = int(log.get("bowling", {}).get("runs_conceded", 0))
            best_bowler = f"{p_name} ({wkts} wickets for {best_bowler_runs} runs)"
        elif wkts == best_bowler_wkts and int(log.get("bowling", {}).get("runs_conceded", 0)) < best_bowler_runs:
            best_bowler_runs = int(log.get("bowling", {}).get("runs_conceded", 0))
            best_bowler = f"{p_name} ({wkts} wickets for {best_bowler_runs} runs)"
            
        # Match impact score calculation: runs + wickets * 25 + catches * 10
        catches = int(log.get("fielding", {}).get("catches", 0))
        impact = runs + (wkts * 25) + (catches * 10)
        if impact > max_impact:
            max_impact = impact
            impact_player = p_name

    # Add dynamic insights if not present
    m_copy["insights"] = {
        "best_batter": best_batter or "N/A",
        "best_bowler": best_bowler or "N/A",
        "impact_player": impact_player or "N/A",
        "turning_point": "Dynamic shift in momentum in the middle overs."
    }
    
    return jsonify(m_copy), 200

@matches_bp.route('', methods=['POST'])
@token_required
@role_required(['ADMIN'])
def create_match():
    db = get_db()
    data = request.get_json() or {}
    match_id = data.get('match_id')
    opponent_a = data.get('opponent_a')
    opponent_b = data.get('opponent_b')
    
    if not match_id or not opponent_a or not opponent_b:
        return jsonify({"message": "match_id, opponent_a, and opponent_b are required!"}), 400
        
    match_doc = {
        "match_id": match_id,
        "opponent_a": opponent_a,
        "opponent_b": opponent_b,
        "venue": data.get('venue', 'Unknown Venue'),
        "date": datetime.datetime.now(),
        "match_type": data.get('match_type', 'T20'),
        "summary": data.get('summary', 'Match uploaded successfully'),
        "scorecard": data.get('scorecard', {
            "team_a": { "runs": 0, "wickets": 0, "overs": 0.0, "name": opponent_a },
            "team_b": { "runs": 0, "wickets": 0, "overs": 0.0, "name": opponent_b }
        }),
        "partnerships": data.get('partnerships', []),
        "manhattan_data": data.get('manhattan_data', {
            "overs": list(range(1, 21)),
            "team_a_runs": [0]*20,
            "team_b_runs": [0]*20
        })
    }
    
    db["matches"].insert_one(match_doc)
    return jsonify({"message": "Match summary created successfully!", "match_id": match_id}), 201

@matches_bp.route('/upload-csv', methods=['POST'])
@token_required
@role_required(['ADMIN'])
def upload_csv():
    # Expects multi-part file upload
    if 'file' not in request.files:
        return jsonify({"message": "No file part in the request!"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No file selected!"}), 400
        
    if not file.filename.endswith('.csv'):
        return jsonify({"message": "Invalid file format. Please upload a CSV!"}), 400
        
    stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
    csv_reader = csv.DictReader(stream)
    
    db = get_db()
    logs_inserted = 0
    players_created = 0
    
    for row in csv_reader:
        player_name = row.get("player_name")
        if not player_name:
            continue
            
        # 1. Resolve Player (case-insensitive search)
        player = db["players"].find_one({"name": {"$regex": f"^{player_name}$", "$options": "i"}})
        if player:
            player_id = str(player["_id"])
        else:
            # Create player on the fly
            new_player_doc = {
                "name": player_name,
                "age": int(row.get("player_age", 25)),
                "country": row.get("player_country", "Unknown"),
                "team": row.get("player_team", "Unknown"),
                "role": row.get("player_role", "Batter"),
                "batting_style": row.get("batting_style", "Right-hand bat"),
                "bowling_style": row.get("bowling_style", "Right-arm medium"),
                "image_url": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300&auto=format&fit=crop&q=80",
                "scout_stats": {
                    "consistency_score": 70.0,
                    "pressure_index": 70.0,
                    "chase_score": 70.0,
                    "powerplay_eff": 70.0,
                    "death_overs_eff": 70.0,
                    "injury_status": "Healthy",
                    "injury_recovery_time": 0,
                    "market_value": 5000000
                }
            }
            res = db["players"].insert_one(new_player_doc)
            player_id = str(res.inserted_id)
            players_created += 1
            
        # 2. Parse Wagon Wheel Data
        ww_raw = row.get("wagon_wheel", "[]")
        try:
            ww = json.loads(ww_raw)
        except:
            ww = []
            
        # 3. Parse Pitch Map Data
        pm_raw = row.get("pitch_map", "[]")
        try:
            pm = json.loads(pm_raw)
        except:
            pm = []
            
        # 4. Create Match Log
        log_doc = {
            "player_id": player_id,
            "match_id": row.get("match_id", "CSV_UPLOADED"),
            "opponent": row.get("opponent", "Unknown Opponent"),
            "venue": row.get("venue", "Unknown Venue"),
            "date": datetime.datetime.now(),
            "match_type": row.get("match_type", "T20"),
            "batting": {
                "runs_scored": int(row.get("runs_scored", 0)),
                "balls_faced": int(row.get("balls_faced", 0)),
                "strike_rate": float(row.get("strike_rate", 0.0)),
                "is_out": row.get("is_out", "true").lower() == "true",
                "dismissal_type": row.get("dismissal_type", "Caught"),
                "fours": int(row.get("fours", 0)),
                "sixes": int(row.get("sixes", 0)),
                "dot_balls": int(row.get("dot_balls_batting", 0)),
                "wagon_wheel": ww
            },
            "bowling": {
                "overs_bowled": float(row.get("overs_bowled", 0.0)),
                "runs_conceded": int(row.get("runs_conceded", 0)),
                "wickets_taken": int(row.get("wickets_taken", 0)),
                "economy_rate": float(row.get("economy_rate", 0.0)),
                "maidens": int(row.get("maidens", 0)),
                "dot_balls": int(row.get("dot_balls_bowling", 0)),
                "pitch_map": pm
            },
            "fielding": {
                "catches": int(row.get("catches", 0)),
                "run_outs": int(row.get("run_outs", 0)),
                "stumpings": int(row.get("stumpings", 0))
            }
        }
        
        db["match_logs"].insert_one(log_doc)
        logs_inserted += 1
        
    return jsonify({
        "message": "CSV upload completed successfully!",
        "logs_inserted": logs_inserted,
        "players_created": players_created
    }), 201
