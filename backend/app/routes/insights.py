import re
from flask import Blueprint, request, jsonify
from app.database import get_db
from app.ml.ml_engine import MLEngine

insights_bp = Blueprint('insights', __name__)

@insights_bp.route('/chat', methods=['POST'])
def chat_assistant():
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    
    if not message:
        return jsonify({"response": "Hello! I am your AI Cricket Insights Assistant. Ask me questions like: 'Who is in better form?', 'Predict Kohli's next score', or 'Compare Bumrah and Starc'."}), 200
        
    db = get_db()
    players = list(db["players"].find())
    
    # Simple NLP matcher
    message_lower = message.lower()
    
    # 1. Resolve players mentioned in the chat
    mentioned_players = []
    for p in players:
        p_name = p.get("name", "")
        # Match full name or last name
        last_name = p_name.split(" ")[-1].lower() if " " in p_name else ""
        first_name = p_name.split(" ")[0].lower()
        
        if p_name.lower() in message_lower or (last_name and last_name in message_lower) or first_name in message_lower:
            mentioned_players.append(p)
            
    # 2. Check for comparisons
    if "compare" in message_lower or "better" in message_lower or "vs" in message_lower:
        if len(mentioned_players) >= 2:
            p1, p2 = mentioned_players[0], mentioned_players[1]
            p1_name, p2_name = p1["name"], p2["name"]
            
            # Fetch career stats
            def get_runs(p_id):
                logs = db["match_logs"].find({"player_id": p_id})
                return sum(int(l.get("batting", {}).get("runs_scored", 0)) for l in logs)
                
            def get_wkts(p_id):
                logs = db["match_logs"].find({"player_id": p_id})
                return sum(int(l.get("bowling", {}).get("wickets_taken", 0)) for l in logs)

            p1_runs = get_runs(str(p1["_id"]))
            p2_runs = get_runs(str(p2["_id"]))
            p1_wkts = get_wkts(str(p1["_id"]))
            p2_wkts = get_wkts(str(p2["_id"]))
            
            p1_form = p1.get("scout_stats", {}).get("consistency_score", 70.0)
            p2_form = p2.get("scout_stats", {}).get("consistency_score", 70.0)
            
            comparison_text = f"Sure, comparing **{p1_name}** and **{p2_name}**:\n\n"
            comparison_text += f"- **Career Runs**: {p1_name} ({p1_runs}) vs {p2_name} ({p2_runs})\n"
            comparison_text += f"- **Career Wickets**: {p1_name} ({p1_wkts}) vs {p2_name} ({p2_wkts})\n"
            comparison_text += f"- **Consistency Rating**: {p1_name} ({p1_form}%) vs {p2_name} ({p2_form}%)\n\n"
            
            if p1_form > p2_form:
                comparison_text += f"**AI Insight**: Based on our statistics, **{p1_name}** is showing greater overall consistency and impact compared to **{p2_name}**."
            else:
                comparison_text += f"**AI Insight**: Based on our statistics, **{p2_name}** is displaying higher overall consistency and impact compared to **{p1_name}**."
                
            return jsonify({"response": comparison_text}), 200
        else:
            return jsonify({"response": "I see you want to compare players, but I couldn't identify two players in your query. Try asking: 'Compare Virat Kohli and Steve Smith'."}), 200
            
    # 3. Check for Predictions
    if "predict" in message_lower or "forecast" in message_lower or "next score" in message_lower or "next match" in message_lower:
        if len(mentioned_players) >= 1:
            p = mentioned_players[0]
            p_id = str(p["_id"])
            p_name = p["name"]
            
            # Predict
            pred = MLEngine.predict_next_match(p_id, "lstm")
            runs = pred["expected_runs"]
            wkts = pred["expected_wickets"]
            sr = pred["expected_strike_rate"]
            form = pred["form_prediction"]
            conf = pred["confidence_score"]
            
            prediction_text = f"**AI Performance Forecast for {p_name} next match (LSTM model)**:\n\n"
            prediction_text += f"- **Expected Runs**: {runs}\n"
            prediction_text += f"- **Expected Wickets**: {wkts}\n"
            prediction_text += f"- **Expected Strike Rate**: {sr}\n"
            prediction_text += f"- **Form Status**: {form} Form\n"
            prediction_text += f"- **Confidence Rating**: {conf}%\n\n"
            prediction_text += f"**AI Insight**: {p_name} is entering this match in **{form.lower()}** shape. Our models suggest a {conf}% probability of them hitting these baseline statistics."
            
            return jsonify({"response": prediction_text}), 200
        else:
            return jsonify({"response": "I would love to predict a score, but I couldn't identify the player. Try asking: 'Predict Kohli's next score'."}), 200

    # 4. Check for general stats
    if len(mentioned_players) >= 1:
        p = mentioned_players[0]
        p_name = p["name"]
        role = p.get("role", "Cricketer")
        country = p.get("country", "International")
        team = p.get("team", "IPL")
        form_score = p.get("scout_stats", {}).get("consistency_score", 70.0)
        
        bio_text = f"Here is the profile for **{p_name}**:\n"
        bio_text += f"- **Role**: {role} ({p.get('batting_style', 'Right Hand')})\n"
        bio_text += f"- **Nation**: {country}\n"
        bio_text += f"- **Franchise Team**: {team}\n"
        bio_text += f"- **Consistency Rating**: {form_score}%\n\n"
        bio_text += f"**AI Insight**: {p_name}'s recent statistics show high involvement in {team}'s core match-ups. You can view their full wagon wheel and pitch landing maps in the Player Profiles section."
        
        return jsonify({"response": bio_text}), 200

    # 5. Default Response
    return jsonify({
        "response": "I couldn't match any specific players in your question. I know about: Virat Kohli, Rohit Sharma, Steve Smith, Jasprit Bumrah, Mitchell Starc, and Rashid Khan. Ask me a query about their form, stats, or future predictions!"
    }), 200

@insights_bp.route('/fantasy', methods=['GET'])
def get_fantasy_recommendations():
    db = get_db()
    players = list(db["players"].find())
    
    if not players:
        return jsonify({"message": "No players in database!"}), 404
        
    # Sort players by consistency score for selection
    sorted_players = sorted(players, key=lambda x: x.get("scout_stats", {}).get("consistency_score", 70.0), reverse=True)
    
    # 1. Best XI selection based on roles
    batters = [p for p in sorted_players if p.get("role") == "Batter"][:4]
    bowlers = [p for p in sorted_players if p.get("role") == "Bowler"][:3]
    all_rounders = [p for p in sorted_players if p.get("role") == "All-Rounder"][:3]
    
    # Combine to construct playing XI
    playing_xi = batters + all_rounders + bowlers
    
    # Ensure we have 11, otherwise pad with others
    used_ids = {str(p["_id"]) for p in playing_xi}
    for p in sorted_players:
        if len(playing_xi) >= 11:
            break
        if str(p["_id"]) not in used_ids:
            playing_xi.append(p)
            used_ids.add(str(p["_id"]))

    # 2. Select Captain and Vice Captain
    captain = sorted_players[0]
    vice_captain = sorted_players[1] if len(sorted_players) > 1 else sorted_players[0]
    
    playing_xi_serialized = []
    for p in playing_xi:
        playing_xi_serialized.append({
            "id": str(p["_id"]),
            "name": p.get("name"),
            "role": p.get("role"),
            "team": p.get("team"),
            "consistency_score": p.get("scout_stats", {}).get("consistency_score", 70.0)
        })

    return jsonify({
        "best_eleven": playing_xi_serialized,
        "captain": {
            "id": str(captain["_id"]),
            "name": captain.get("name"),
            "consistency_score": captain.get("scout_stats", {}).get("consistency_score", 70.0),
            "reason": f"Captain selection is based on leading Consistency Rating ({captain.get('scout_stats', {}).get('consistency_score', 70.0)}%) in recent tournament logs."
        },
        "vice_captain": {
            "id": str(vice_captain["_id"]),
            "name": vice_captain.get("name"),
            "consistency_score": vice_captain.get("scout_stats", {}).get("consistency_score", 70.0),
            "reason": "Vice-Captain selected due to secondary high scoring impact and pressure index."
        }
    }), 200

@insights_bp.route('/injury', methods=['POST'])
def injury_impact():
    db = get_db()
    data = request.get_json() or {}
    player_id = data.get('player_id')
    
    if not player_id:
        return jsonify({"message": "player_id parameter is required!"}), 400
        
    player = db["players"].find_one({"_id": player_id})
    if not player:
        return jsonify({"message": "Player not found!"}), 404
        
    p_name = player["name"]
    role = player.get("role", "Batter")
    scout = player.get("scout_stats", {})
    consistency = scout.get("consistency_score", 80.0)
    
    # Simulates team strength loss when this player is sidelined
    if role == "Bowler":
        strength_reduction = round(consistency * 0.25, 1) # e.g. 24% drop
        impact_desc = f"Sidelining {p_name} reduces the team's bowling impact index by {strength_reduction}%. Expected death-over economy rate will rise by approximately 1.8 runs per over, and wicket-taking frequency in the Powerplay drops by 30%."
    elif role == "Batter":
        strength_reduction = round(consistency * 0.22, 1)
        impact_desc = f"Injuring {p_name} decreases top-order stability. The team's batting consistency rating drops by {strength_reduction}%. Run scoring rate in the middle-overs is forecasted to drop from 8.4 to 7.1 runs per over, increasing chase pressure by 15%."
    else: # All rounder
        strength_reduction = round(consistency * 0.28, 1)
        impact_desc = f"Losing All-Rounder {p_name} disrupts the team's tactical balance. Sidelining them reduces overall team depth index by {strength_reduction}%, losing 4 overs of economy bowling and mid-order power hitting."

    return jsonify({
        "player_id": player_id,
        "player_name": p_name,
        "role": role,
        "impact_score_reduction_percent": strength_reduction,
        "simulation_report": impact_desc,
        "recovery_estimate_days": scout.get("injury_recovery_time", 14) or 14
    }), 200

@insights_bp.route('/auction', methods=['GET'])
def get_auction_predictions():
    db = get_db()
    players = list(db["players"].find())
    
    result = []
    for p in players:
        p_id = str(p["_id"])
        scout = p.get("scout_stats", {})
        consistency = scout.get("consistency_score", 75.0)
        pressure = scout.get("pressure_index", 75.0)
        age = p.get("age", 30)
        role = p.get("role", "Batter")
        
        # Calculate dynamic auction price prediction (Valuation in INR Rupees)
        # Base bid: 5,000,000 (50 Lakhs)
        base_bid = 5000000
        
        # Age penalty: peaks at 26-29, older players have lower long-term value
        age_factor = 1.0
        if age > 30:
            age_factor = max(0.4, 1.0 - (age - 30) * 0.05)
        elif age < 24:
            age_factor = 1.1 # Premium for youth talent
            
        role_multiplier = 1.2 if role in ["Bowler", "All-Rounder"] else 1.0
        
        # Score calculation: consistency and pressure index weights
        perf_score = (consistency * 0.6) + (pressure * 0.4)
        predicted_value = int(base_bid * (perf_score / 50.0) * role_multiplier * age_factor * 1.8)
        
        # Format in Indian Rupees formatting (Lakhs and Crores)
        if predicted_value >= 10000000: # 1 Crore or more
            formatted_val = f"₹{round(predicted_value / 10000000, 2)} Cr"
        else:
            formatted_val = f"₹{round(predicted_value / 100000, 2)} Lakh"

        result.append({
            "player_id": p_id,
            "name": p.get("name"),
            "role": role,
            "age": age,
            "consistency": consistency,
            "market_value_actual": scout.get("market_value", 5000000),
            "predicted_market_value": predicted_value,
            "formatted_predicted_value": formatted_val
        })
        
    # Sort from highest value to lowest
    result.sort(key=lambda x: x["predicted_market_value"], reverse=True)
    return jsonify(result), 200
