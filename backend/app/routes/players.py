from flask import Blueprint, request, jsonify, g
import numpy as np
from app.database import get_db
from app.routes.auth import token_required, role_required

players_bp = Blueprint('players', __name__)

@players_bp.route('', methods=['GET'])
def get_players():
    db = get_db()
    name_query = request.args.get('name', '')
    role = request.args.get('role', '')
    country = request.args.get('country', '')
    team = request.args.get('team', '')
    
    query = {}
    if name_query:
        query["name"] = {"$regex": name_query}
    if role:
        query["role"] = role
    if country:
        query["country"] = country
    if team:
        query["team"] = team
        
    players_list = db["players"].find(query)
    
    # Enrich players with simple summaries
    result = []
    for p in players_list:
        p_id = str(p["_id"])
        match_count = db["match_logs"].count_documents({"player_id": p_id})
        
        # Calculate summary career numbers
        logs = db["match_logs"].find({"player_id": p_id})
        total_runs = sum(int(log.get("batting", {}).get("runs_scored", 0)) for log in logs)
        
        logs = db["match_logs"].find({"player_id": p_id})
        total_wkts = sum(int(log.get("bowling", {}).get("wickets_taken", 0)) for log in logs)
        
        doc = {
            "id": p_id,
            "name": p.get("name"),
            "age": p.get("age"),
            "country": p.get("country"),
            "team": p.get("team"),
            "role": p.get("role"),
            "batting_style": p.get("batting_style"),
            "bowling_style": p.get("bowling_style"),
            "image_url": p.get("image_url"),
            "match_count": match_count,
            "total_runs": total_runs,
            "total_wickets": total_wkts,
            "scout_stats": p.get("scout_stats", {})
        }
        result.append(doc)
        
    return jsonify(result), 200

@players_bp.route('/<player_id>', methods=['GET'])
def get_player_by_id(player_id):
    db = get_db()
    player = db["players"].find_one({"_id": player_id})
    if not player:
        return jsonify({"message": "Player not found!"}), 404
        
    logs = db["match_logs"].find({"player_id": player_id})
    
    # Batting variables
    bat_innings = 0
    runs_list = []
    balls_faced_list = []
    fours_list = []
    sixes_list = []
    dots_bat_list = []
    outs_count = 0
    highest_score = 0
    highest_is_out = True
    fifties = 0
    hundreds = 0
    wagon_wheel_all = []
    
    # Bowling variables
    bowl_innings = 0
    wickets_list = []
    runs_conceded_list = []
    overs_list = []
    maidens_list = []
    dots_bowl_list = []
    pitch_map_all = []
    best_w = 0
    best_r = 999
    
    # Fielding variables
    catches = 0
    run_outs = 0
    stumpings = 0
    
    for log in logs:
        bat = log.get("batting", {})
        bowl = log.get("bowling", {})
        fld = log.get("fielding", {})
        
        # Batting processing
        runs = int(bat.get("runs_scored", 0))
        balls = int(bat.get("balls_faced", 0))
        if balls > 0 or bat.get("dismissal_type") != "Did Not Bat":
            bat_innings += 1
            runs_list.append(runs)
            balls_faced_list.append(balls)
            fours_list.append(int(bat.get("fours", 0)))
            sixes_list.append(int(bat.get("sixes", 0)))
            dots_bat_list.append(int(bat.get("dot_balls", 0)))
            
            if bat.get("is_out", True):
                outs_count += 1
                
            # Highest Score check
            if runs > highest_score:
                highest_score = runs
                highest_is_out = bat.get("is_out", True)
            elif runs == highest_score and not bat.get("is_out", True):
                highest_is_out = False
                
            if 50 <= runs < 100:
                fifties += 1
            elif runs >= 100:
                hundreds += 1
                
            # Collect Wagon Wheel
            if "wagon_wheel" in bat:
                wagon_wheel_all.extend(bat["wagon_wheel"])
                
        # Bowling processing
        ov = float(bowl.get("overs_bowled", 0.0))
        if ov > 0.0:
            bowl_innings += 1
            wkt = int(bowl.get("wickets_taken", 0))
            rc = int(bowl.get("runs_conceded", 0))
            
            wickets_list.append(wkt)
            runs_conceded_list.append(rc)
            overs_list.append(ov)
            maidens_list.append(int(bowl.get("maidens", 0)))
            dots_bowl_list.append(int(bowl.get("dot_balls", 0)))
            
            # Best Figures check
            if wkt > best_w:
                best_w = wkt
                best_r = rc
            elif wkt == best_w and rc < best_r:
                best_r = rc
                
            # Collect Pitch Map
            if "pitch_map" in bowl:
                pitch_map_all.extend(bowl["pitch_map"])
                
        # Fielding processing
        catches += int(fld.get("catches", 0))
        run_outs += int(fld.get("run_outs", 0))
        stumpings += int(fld.get("stumpings", 0))

    # Compute Batting Averages
    tot_runs = sum(runs_list)
    tot_balls = sum(balls_faced_list)
    bat_avg = tot_runs / outs_count if outs_count > 0 else (tot_runs if tot_runs > 0 else 0.0)
    bat_sr = (tot_runs / tot_balls * 100.0) if tot_balls > 0 else 0.0
    dot_ball_pct_bat = (sum(dots_bat_list) / tot_balls * 100.0) if tot_balls > 0 else 0.0
    boundary_pct = ((sum(fours_list)*4 + sum(sixes_list)*6) / tot_runs * 100.0) if tot_runs > 0 else 0.0
    
    # Compute Bowling Averages
    tot_wkts = sum(wickets_list)
    tot_rc = sum(runs_conceded_list)
    
    # Convert fractional overs to ball count: 3.2 overs = 3*6 + 2 = 20 balls.
    tot_balls_bowled = 0
    for ov in overs_list:
        full_overs = int(ov)
        partial = round((ov - full_overs) * 10)
        tot_balls_bowled += full_overs * 6 + partial
        
    tot_overs = tot_balls_bowled / 6.0
    
    bowl_econ = (tot_rc / tot_overs) if tot_overs > 0 else 0.0
    bowl_avg = (tot_rc / tot_wkts) if tot_wkts > 0 else 0.0
    bowl_sr = (tot_balls_bowled / tot_wkts) if tot_wkts > 0 else 0.0
    dot_ball_pct_bowl = (sum(dots_bowl_list) / tot_balls_bowled * 100.0) if tot_balls_bowled > 0 else 0.0

    # Build response stats dictionary
    career_stats = {
        "batting": {
            "matches": bat_innings,
            "innings": bat_innings,
            "runs": tot_runs,
            "average": round(bat_avg, 2),
            "strike_rate": round(bat_sr, 2),
            "highest_score": f"{highest_score}{'' if highest_is_out else '*'}",
            "fifties": fifties,
            "hundreds": hundreds,
            "fours": sum(fours_list),
            "sixes": sum(sixes_list),
            "dot_ball_percentage": round(dot_ball_pct_bat, 2),
            "boundary_percentage": round(boundary_pct, 2)
        },
        "bowling": {
            "matches": bowl_innings,
            "wickets": tot_wkts,
            "economy": round(bowl_econ, 2),
            "average": round(bowl_avg, 2),
            "strike_rate": round(bowl_sr, 2),
            "best_figures": f"{best_w}/{best_r}" if best_r != 999 else "N/A",
            "maidens": sum(maidens_list),
            "dot_ball_percentage": round(dot_ball_pct_bowl, 2)
        },
        "fielding": {
            "catches": catches,
            "run_outs": run_outs,
            "stumpings": stumpings
        }
    }

    # Fetch recent form trends
    recent_logs = sorted(db["match_logs"].find({"player_id": player_id}), key=lambda x: x.get("date", ""), reverse=True)[:5]
    recent_form = []
    for log in recent_logs:
        if player.get("role") in ["Batter", "All-Rounder"]:
            recent_form.append({
                "match": log.get("opponent", "Match"),
                "value": log.get("batting", {}).get("runs_scored", 0),
                "type": "Runs"
            })
        else:
            recent_form.append({
                "match": log.get("opponent", "Match"),
                "value": log.get("bowling", {}).get("wickets_taken", 0),
                "type": "Wickets"
            })
            
    recent_form.reverse() # Back to chronological for UI rendering

    # Compile wagon wheel summaries by category
    wagon_wheel_summary = {}
    for item in wagon_wheel_all:
        area = item.get("area", "Unknown")
        runs = int(item.get("runs", 0))
        wagon_wheel_summary[area] = wagon_wheel_summary.get(area, 0) + runs

    # Compile pitch map lengths summary
    pitch_map_summary = {}
    for item in pitch_map_all:
        length = item.get("length", "Unknown")
        pitch_map_summary[length] = pitch_map_summary.get(length, 0) + 1

    return jsonify({
        "id": str(player["_id"]),
        "name": player.get("name"),
        "age": player.get("age"),
        "country": player.get("country"),
        "team": player.get("team"),
        "role": player.get("role"),
        "batting_style": player.get("batting_style"),
        "bowling_style": player.get("bowling_style"),
        "image_url": player.get("image_url"),
        "scout_stats": player.get("scout_stats", {}),
        "career_stats": career_stats,
        "recent_form": recent_form,
        "wagon_wheel": wagon_wheel_all,
        "wagon_wheel_summary": [{"area": k, "runs": v} for k, v in wagon_wheel_summary.items()],
        "pitch_map": pitch_map_all,
        "pitch_map_summary": [{"length": k, "count": v} for k, v in pitch_map_summary.items()]
    }), 200

@players_bp.route('/<player_id>/matches', methods=['GET'])
def get_player_matches(player_id):
    db = get_db()
    logs = db["match_logs"].find({"player_id": player_id})
    logs_serialized = []
    for log in logs:
        log_copy = dict(log)
        log_copy["_id"] = str(log_copy["_id"])
        logs_serialized.append(log_copy)
    return jsonify(logs_serialized), 200

@players_bp.route('', methods=['POST'])
@token_required
@role_required(['ADMIN'])
def create_player():
    db = get_db()
    data = request.get_json() or {}
    name = data.get('name')
    if not name:
        return jsonify({"message": "Player name is required!"}), 400
        
    player_doc = {
        "name": name,
        "age": int(data.get('age', 25)),
        "country": data.get('country', 'Unknown'),
        "team": data.get('team', 'Unknown'),
        "role": data.get('role', 'All-Rounder'),
        "batting_style": data.get('batting_style', 'Right-hand bat'),
        "bowling_style": data.get('bowling_style', 'Right-arm medium'),
        "image_url": data.get('image_url', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300&auto=format&fit=crop&q=80'),
        "scout_stats": {
            "consistency_score": float(data.get('consistency_score', 75.0)),
            "pressure_index": float(data.get('pressure_index', 75.0)),
            "chase_score": float(data.get('chase_score', 75.0)),
            "powerplay_eff": float(data.get('powerplay_eff', 75.0)),
            "death_overs_eff": float(data.get('death_overs_eff', 75.0)),
            "injury_status": data.get('injury_status', 'Healthy'),
            "injury_recovery_time": int(data.get('injury_recovery_time', 0)),
            "market_value": int(data.get('market_value', 10000000))
        }
    }
    
    res = db["players"].insert_one(player_doc)
    return jsonify({"message": "Player created successfully!", "id": str(res.inserted_id)}), 201

@players_bp.route('/<player_id>', methods=['PUT'])
@token_required
@role_required(['ADMIN'])
def update_player(player_id):
    db = get_db()
    data = request.get_json() or {}
    
    player = db["players"].find_one({"_id": player_id})
    if not player:
        return jsonify({"message": "Player not found!"}), 404
        
    set_fields = {}
    for key in ['name', 'age', 'country', 'team', 'role', 'batting_style', 'bowling_style', 'image_url']:
        if key in data:
            set_fields[key] = data[key]
            
    # Sub fields update
    for sub in ['consistency_score', 'pressure_index', 'chase_score', 'powerplay_eff', 'death_overs_eff', 'injury_status', 'injury_recovery_time', 'market_value']:
        if sub in data:
            set_fields[f"scout_stats.{sub}"] = data[sub]
            
    if not set_fields:
        return jsonify({"message": "No fields to update!"}), 400
        
    db["players"].update_one({"_id": player_id}, {"$set": set_fields})
    return jsonify({"message": "Player updated successfully!"}), 200

@players_bp.route('/<player_id>', methods=['DELETE'])
@token_required
@role_required(['ADMIN'])
def delete_player(player_id):
    db = get_db()
    player = db["players"].find_one({"_id": player_id})
    if not player:
        return jsonify({"message": "Player not found!"}), 404
        
    db["players"].delete_one({"_id": player_id})
    db["match_logs"].delete_many({"player_id": player_id})
    return jsonify({"message": "Player deleted successfully!"}), 200
