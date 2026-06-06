from flask import Blueprint, request, jsonify
from app.database import get_db

scouting_bp = Blueprint('scouting', __name__)

@scouting_bp.route('/rankings', methods=['GET'])
def get_rankings():
    db = get_db()
    players = list(db["players"].find())
    
    batting_rankings = []
    bowling_rankings = []
    
    for p in players:
        p_id = str(p["_id"])
        name = p["name"]
        team = p.get("team")
        role = p.get("role")
        scout = p.get("scout_stats", {})
        
        # Aggregate runs/wickets from match logs
        logs = list(db["match_logs"].find({"player_id": p_id}))
        runs_list = [int(log.get("batting", {}).get("runs_scored", 0)) for log in logs]
        wkts_list = [int(log.get("bowling", {}).get("wickets_taken", 0)) for log in logs]
        balls_faced = sum(int(log.get("batting", {}).get("balls_faced", 0)) for log in logs)
        
        total_runs = sum(runs_list)
        total_wkts = sum(wkts_list)
        
        # Calculate rates
        avg_sr = (total_runs / balls_faced * 100.0) if balls_faced > 0 else 0.0
        
        outs = sum(1 for log in logs if log.get("batting", {}).get("is_out", True))
        avg_runs = total_runs / outs if outs > 0 else total_runs
        
        if role in ["Batter", "All-Rounder"]:
            batting_rankings.append({
                "player_id": p_id,
                "name": name,
                "team": team,
                "runs": total_runs,
                "average": round(avg_runs, 2),
                "strike_rate": round(avg_sr, 2),
                "consistency": scout.get("consistency_score", 70.0)
            })
            
        if role in ["Bowler", "All-Rounder"]:
            # Bowling econ aggregate
            runs_con = sum(int(log.get("bowling", {}).get("runs_conceded", 0)) for log in logs)
            
            tot_balls = 0
            for log in logs:
                ov = float(log.get("bowling", {}).get("overs_bowled", 0.0))
                full = int(ov)
                partial = round((ov - full) * 10)
                tot_balls += full * 6 + partial
            
            tot_overs = tot_balls / 6.0
            avg_econ = (runs_con / tot_overs) if tot_overs > 0 else 0.0
            
            bowling_rankings.append({
                "player_id": p_id,
                "name": name,
                "team": team,
                "wickets": total_wkts,
                "economy": round(avg_econ, 2),
                "consistency": scout.get("consistency_score", 70.0)
            })
            
    # Sort rankings
    batting_rankings.sort(key=lambda x: x["runs"], reverse=True)
    bowling_rankings.sort(key=lambda x: x["wickets"], reverse=True)
    
    return jsonify({
        "batting": batting_rankings,
        "bowling": bowling_rankings
    }), 200

@scouting_bp.route('/talents', methods=['GET'])
def get_emerging_talents():
    # Emerging talent: Age <= 32 and consistency score >= 85
    db = get_db()
    players = list(db["players"].find())
    
    talents = []
    for p in players:
        age = p.get("age", 30)
        scout = p.get("scout_stats", {})
        consistency = scout.get("consistency_score", 70.0)
        
        # High potential if age is young and consistency is high
        if age <= 32 and consistency >= 85.0:
            talents.append({
                "player_id": str(p["_id"]),
                "name": p["name"],
                "age": age,
                "country": p.get("country"),
                "role": p.get("role"),
                "team": p.get("team"),
                "consistency": consistency,
                "pressure_index": scout.get("pressure_index", 70.0)
            })
            
    talents.sort(key=lambda x: x["consistency"], reverse=True)
    return jsonify(talents), 200
