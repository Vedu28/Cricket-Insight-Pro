import datetime
import bcrypt
import json
from app.database import get_db

def get_password_hash(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def seed_database():
    db = get_db()
    
    # 1. Seed Users (clear existing users)
    users_col = db["users"]
    users_col.delete_one({"email": "admin@cricketinsight.com"})
    users_col.delete_one({"email": "analyst@cricketinsight.com"})
    users_col.delete_one({"email": "user@cricketinsight.com"})
    
    admin_hash = get_password_hash("password123")
    users_col.insert_one({
        "name": "Admin User",
        "email": "admin@cricketinsight.com",
        "password_hash": admin_hash,
        "role": "ADMIN",
        "is_verified": True,
        "created_at": datetime.datetime.now()
    })
    
    analyst_hash = get_password_hash("password123")
    users_col.insert_one({
        "name": "Head Analyst",
        "email": "analyst@cricketinsight.com",
        "password_hash": analyst_hash,
        "role": "ANALYST",
        "is_verified": True,
        "created_at": datetime.datetime.now()
    })
    
    user_hash = get_password_hash("password123")
    users_col.insert_one({
        "name": "Cricket Fan",
        "email": "user@cricketinsight.com",
        "password_hash": user_hash,
        "role": "USER",
        "is_verified": True,
        "created_at": datetime.datetime.now()
    })
    
    print("[Seed] Seeded Users (Admin, Analyst, User).")

    # 2. Seed Players
    players_col = db["players"]
    players_col.delete_one({"name": "Virat Kohli"})
    players_col.delete_one({"name": "Rohit Sharma"})
    players_col.delete_one({"name": "Steve Smith"})
    players_col.delete_one({"name": "Jasprit Bumrah"})
    players_col.delete_one({"name": "Mitchell Starc"})
    players_col.delete_one({"name": "Rashid Khan"})
    
    players = [
        {
            "name": "Virat Kohli",
            "age": 37,
            "country": "India",
            "team": "Royal Challengers Bengaluru",
            "role": "Batter",
            "batting_style": "Right-hand bat",
            "bowling_style": "Right-arm medium",
            "image_url": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300&auto=format&fit=crop&q=80",
            "scout_stats": {
                "consistency_score": 94.5,
                "pressure_index": 97.2,
                "chase_score": 99.1,
                "powerplay_eff": 82.4,
                "death_overs_eff": 89.5,
                "injury_status": "Healthy",
                "injury_recovery_time": 0,
                "market_value": 150000000
            }
        },
        {
            "name": "Rohit Sharma",
            "age": 38,
            "country": "India",
            "team": "Mumbai Indians",
            "role": "Batter",
            "batting_style": "Right-hand bat",
            "bowling_style": "Right-arm offbreak",
            "image_url": "https://images.unsplash.com/photo-1540747737956-378724044453?w=300&auto=format&fit=crop&q=80",
            "scout_stats": {
                "consistency_score": 86.8,
                "pressure_index": 91.5,
                "chase_score": 88.3,
                "powerplay_eff": 94.1,
                "death_overs_eff": 86.2,
                "injury_status": "Healthy",
                "injury_recovery_time": 0,
                "market_value": 120000000
            }
        },
        {
            "name": "Steve Smith",
            "age": 36,
            "country": "Australia",
            "team": "Sydney Sixers",
            "role": "Batter",
            "batting_style": "Right-hand bat",
            "bowling_style": "Right-arm legbreak",
            "image_url": "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=300&auto=format&fit=crop&q=80",
            "scout_stats": {
                "consistency_score": 91.2,
                "pressure_index": 93.8,
                "chase_score": 85.4,
                "powerplay_eff": 70.2,
                "death_overs_eff": 78.4,
                "injury_status": "Minor Strain",
                "injury_recovery_time": 5,
                "market_value": 80000000
            }
        },
        {
            "name": "Jasprit Bumrah",
            "age": 32,
            "country": "India",
            "team": "Mumbai Indians",
            "role": "Bowler",
            "batting_style": "Right-hand bat",
            "bowling_style": "Right-arm fast",
            "image_url": "https://images.unsplash.com/photo-1629285483773-6b5cde2171d7?w=300&auto=format&fit=crop&q=80",
            "scout_stats": {
                "consistency_score": 96.7,
                "pressure_index": 98.4,
                "chase_score": 92.5,
                "powerplay_eff": 93.0,
                "death_overs_eff": 98.9,
                "injury_status": "Healthy",
                "injury_recovery_time": 0,
                "market_value": 160000000
            }
        },
        {
            "name": "Mitchell Starc",
            "age": 36,
            "country": "Australia",
            "team": "Kolkata Knight Riders",
            "role": "Bowler",
            "batting_style": "Left-hand bat",
            "bowling_style": "Left-arm fast",
            "image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
            "scout_stats": {
                "consistency_score": 82.5,
                "pressure_index": 88.0,
                "chase_score": 80.0,
                "powerplay_eff": 89.2,
                "death_overs_eff": 91.4,
                "injury_status": "Healthy",
                "injury_recovery_time": 0,
                "market_value": 110000000
            }
        },
        {
            "name": "Rashid Khan",
            "age": 27,
            "country": "Afghanistan",
            "team": "Gujarat Titans",
            "role": "All-Rounder",
            "batting_style": "Right-hand bat",
            "bowling_style": "Right-arm legbreak",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
            "scout_stats": {
                "consistency_score": 93.1,
                "pressure_index": 95.8,
                "chase_score": 90.4,
                "powerplay_eff": 88.5,
                "death_overs_eff": 94.6,
                "injury_status": "Healthy",
                "injury_recovery_time": 0,
                "market_value": 140000000
            }
        }
    ]
    
    # Store inserted player objects to map logs
    seeded_players = {}
    for p in players:
        res = players_col.insert_one(p)
        seeded_players[p["name"]] = str(res.inserted_id)
        
    print(f"[Seed] Seeded {len(players)} Players.")

    # 3. Seed Matches
    matches_col = db["matches"]
    matches_col.delete_many({})
    
    base_date = datetime.datetime.now() - datetime.timedelta(days=100)
    
    match_data_list = [
        {
            "match_id": "M001",
            "opponent_a": "India",
            "opponent_b": "Pakistan",
            "venue": "MCG, Melbourne",
            "date": base_date,
            "match_type": "T20",
            "summary": "India won by 4 wickets in a thrilling final-ball finish.",
            "scorecard": {
                "team_a": { "runs": 160, "wickets": 4, "overs": 20.0, "name": "India" },
                "team_b": { "runs": 159, "wickets": 8, "overs": 20.0, "name": "Pakistan" }
            },
            "partnerships": [
                { "batter_1": "Virat Kohli", "batter_2": "Hardik Pandya", "runs": 113, "balls": 78 },
                { "batter_1": "KL Rahul", "batter_2": "Rohit Sharma", "runs": 10, "balls": 12 }
            ],
            "manhattan_data": {
                "overs": list(range(1, 21)),
                "team_a_runs": [4, 6, 3, 5, 2, 8, 4, 7, 10, 12, 11, 15, 6, 8, 14, 18, 12, 16, 15, 16],
                "team_b_runs": [6, 8, 5, 4, 9, 3, 5, 6, 7, 8, 9, 11, 12, 7, 8, 10, 11, 12, 13, 9]
            }
        },
        {
            "match_id": "M002",
            "opponent_a": "India",
            "opponent_b": "Australia",
            "venue": "Narendra Modi Stadium, Ahmedabad",
            "date": base_date + datetime.timedelta(days=10),
            "match_type": "ODI",
            "summary": "Australia won by 6 wickets, clinching the series.",
            "scorecard": {
                "team_a": { "runs": 240, "wickets": 10, "overs": 50.0, "name": "India" },
                "team_b": { "runs": 241, "wickets": 4, "overs": 43.0, "name": "Australia" }
            },
            "partnerships": [
                { "batter_1": "Travis Head", "batter_2": "Marnus Labuschagne", "runs": 192, "balls": 215 },
                { "batter_1": "Virat Kohli", "batter_2": "KL Rahul", "runs": 67, "balls": 109 }
            ],
            "manhattan_data": {
                "overs": [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
                "team_a_runs": [30, 52, 78, 105, 130, 154, 178, 201, 222, 240],
                "team_b_runs": [28, 45, 69, 98, 128, 160, 195, 225, 241, 0]
            }
        },
        {
            "match_id": "M003",
            "opponent_a": "Australia",
            "opponent_b": "England",
            "venue": "Lord's, London",
            "date": base_date + datetime.timedelta(days=20),
            "match_type": "Test",
            "summary": "Australia won by 43 runs in a tense Ashes encounter.",
            "scorecard": {
                "team_a": { "runs": 416, "wickets": 10, "overs": 100.4, "name": "Australia" },
                "team_b": { "runs": 373, "wickets": 10, "overs": 95.2, "name": "England" }
            },
            "partnerships": [
                { "batter_1": "Steve Smith", "batter_2": "Travis Head", "runs": 118, "balls": 180 },
                { "batter_1": "Ben Stokes", "batter_2": "Jonny Bairstow", "runs": 85, "balls": 112 }
            ],
            "manhattan_data": {
                "overs": [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                "team_a_runs": [40, 85, 130, 172, 215, 255, 290, 340, 385, 416],
                "team_b_runs": [35, 78, 115, 158, 192, 230, 274, 312, 350, 373]
            }
        }
    ]
    
    for m in match_data_list:
        matches_col.insert_one(m)
        
    print(f"[Seed] Seeded {len(match_data_list)} general matches summaries.")

    # 4. Seed Match Logs for Players
    logs_col = db["match_logs"]
    logs_col.delete_many({})
    
    # 4.1 Seed Virat Kohli
    kohli_id = seeded_players["Virat Kohli"]
    kohli_opponents = ["Pakistan", "Australia", "England", "New Zealand", "South Africa", "Sri Lanka", "West Indies", "Bangladesh", "Afghanistan", "Pakistan"]
    kohli_venues = ["MCG, Melbourne", "Wankhede, Mumbai", "Lord's, London", "Eden Park, Auckland", "Newlands, Cape Town", "Premadasa, Colombo", "Kensington Oval, Barbados", "Mirpur, Dhaka", "Dubai Stadium, Dubai", "Eden Gardens, Kolkata"]
    kohli_runs = [82, 54, 12, 101, 77, 4, 36, 117, 8, 49]
    kohli_balls = [53, 38, 19, 61, 52, 9, 28, 95, 11, 32]
    kohli_outs = [False, True, True, False, True, True, True, True, True, False]
    kohli_dismissals = ["Not Out", "Caught", "LBW", "Not Out", "Caught", "Bowled", "Caught", "Caught", "LBW", "Not Out"]
    kohli_fours = [6, 4, 1, 9, 7, 0, 3, 11, 1, 4]
    kohli_sixes = [4, 1, 0, 3, 2, 0, 1, 2, 0, 1]
    kohli_dots = [15, 12, 9, 14, 18, 5, 10, 28, 6, 11]
    
    # Standard Wagon Wheel zones: Off-Side (Cover, Point, Third-Man, Mid-Off), Leg-Side (Square-Leg, Mid-Wicket, Fine-Leg, Mid-On)
    def make_wagon_wheel(runs_scored):
        if runs_scored == 0: return []
        # Distribute runs across zones
        import random
        random.seed(42 + runs_scored)
        zones = [
            {"area": "Cover", "angle": 45},
            {"area": "Point", "angle": 15},
            {"area": "Third-Man", "angle": 315},
            {"area": "Mid-Off", "angle": 90},
            {"area": "Mid-On", "angle": 180},
            {"area": "Mid-Wicket", "angle": 135},
            {"area": "Square-Leg", "angle": 225},
            {"area": "Fine-Leg", "angle": 270}
        ]
        
        items = []
        rem = runs_scored
        while rem > 0:
            val = random.choice([1, 2, 4, 6])
            if val > rem: val = rem
            zone = random.choice(zones)
            items.append({
                "angle": zone["angle"] + random.randint(-15, 15),
                "runs": val,
                "area": zone["area"]
            })
            rem -= val
        return items

    for i in range(10):
        m_date = base_date + datetime.timedelta(days=i*7)
        ww = make_wagon_wheel(kohli_runs[i])
        logs_col.insert_one({
            "player_id": kohli_id,
            "match_id": f"K_MATCH_{i+1}",
            "opponent": kohli_opponents[i],
            "venue": kohli_venues[i],
            "date": m_date,
            "match_type": "T20" if i % 2 == 0 else "ODI",
            "batting": {
                "runs_scored": kohli_runs[i],
                "balls_faced": kohli_balls[i],
                "strike_rate": round(kohli_runs[i] / kohli_balls[i] * 100.0, 1) if kohli_balls[i] > 0 else 0.0,
                "is_out": kohli_outs[i],
                "dismissal_type": kohli_dismissals[i],
                "fours": kohli_fours[i],
                "sixes": kohli_sixes[i],
                "dot_balls": kohli_dots[i],
                "wagon_wheel": ww
            },
            "bowling": {
                "overs_bowled": 0.0,
                "runs_conceded": 0,
                "wickets_taken": 0,
                "economy_rate": 0.0,
                "maidens": 0,
                "dot_balls": 0,
                "pitch_map": []
            },
            "fielding": { "catches": 1 if i % 3 == 0 else 0, "run_outs": 0, "stumpings": 0 }
        })

    # 4.2 Seed Rohit Sharma
    rohit_id = seeded_players["Rohit Sharma"]
    rohit_runs = [28, 86, 0, 15, 121, 64, 40, 57, 8, 48]
    rohit_balls = [15, 50, 2, 10, 69, 41, 21, 38, 5, 29]
    rohit_fours = [3, 8, 0, 1, 12, 6, 4, 5, 1, 5]
    rohit_sixes = [2, 4, 0, 1, 8, 3, 2, 3, 0, 2]
    
    for i in range(10):
        m_date = base_date + datetime.timedelta(days=i*7 + 1)
        ww = make_wagon_wheel(rohit_runs[i])
        logs_col.insert_one({
            "player_id": rohit_id,
            "match_id": f"R_MATCH_{i+1}",
            "opponent": kohli_opponents[i],
            "venue": kohli_venues[i],
            "date": m_date,
            "match_type": "T20" if i % 2 == 0 else "ODI",
            "batting": {
                "runs_scored": rohit_runs[i],
                "balls_faced": rohit_balls[i],
                "strike_rate": round(rohit_runs[i] / rohit_balls[i] * 100.0, 1) if rohit_balls[i] > 0 else 0.0,
                "is_out": True if rohit_runs[i] != 121 else False,
                "dismissal_type": "Caught" if rohit_runs[i] != 121 else "Not Out",
                "fours": rohit_fours[i],
                "sixes": rohit_sixes[i],
                "dot_balls": int(rohit_balls[i] * 0.4),
                "wagon_wheel": ww
            },
            "bowling": {
                "overs_bowled": 0.0,
                "runs_conceded": 0,
                "wickets_taken": 0,
                "economy_rate": 0.0,
                "maidens": 0,
                "dot_balls": 0,
                "pitch_map": []
            },
            "fielding": { "catches": 0, "run_outs": 1 if i == 4 else 0, "stumpings": 0 }
        })

    # 4.3 Seed Steve Smith
    smith_id = seeded_players["Steve Smith"]
    smith_runs = [35, 9, 80, 46, 110, 6, 74, 50, 21, 62]
    smith_balls = [52, 12, 78, 65, 185, 8, 105, 71, 35, 89]
    
    for i in range(10):
        m_date = base_date + datetime.timedelta(days=i*7 + 2)
        ww = make_wagon_wheel(smith_runs[i])
        logs_col.insert_one({
            "player_id": smith_id,
            "match_id": f"S_MATCH_{i+1}",
            "opponent": "England" if i % 2 == 0 else "India",
            "venue": "Lord's, London" if i % 2 == 0 else "MCG, Melbourne",
            "date": m_date,
            "match_type": "Test" if i % 3 == 0 else "ODI",
            "batting": {
                "runs_scored": smith_runs[i],
                "balls_faced": smith_balls[i],
                "strike_rate": round(smith_runs[i] / smith_balls[i] * 100.0, 1) if smith_balls[i] > 0 else 0.0,
                "is_out": True if smith_runs[i] != 80 else False,
                "dismissal_type": "Caught" if smith_runs[i] != 80 else "Not Out",
                "fours": int(smith_runs[i] * 0.08),
                "sixes": int(smith_runs[i] * 0.01),
                "dot_balls": int(smith_balls[i] * 0.55),
                "wagon_wheel": ww
            },
            "bowling": {
                "overs_bowled": 0.0,
                "runs_conceded": 0,
                "wickets_taken": 0,
                "economy_rate": 0.0,
                "maidens": 0,
                "dot_balls": 0,
                "pitch_map": []
            },
            "fielding": { "catches": 2 if i == 2 else 0, "run_outs": 0, "stumpings": 0 }
        })

    # 4.4 Seed Jasprit Bumrah
    bumrah_id = seeded_players["Jasprit Bumrah"]
    bumrah_wickets = [2, 4, 1, 0, 3, 2, 4, 1, 2, 3]
    bumrah_runs_con = [18, 14, 25, 34, 10, 22, 19, 28, 12, 15]
    bumrah_overs = [4.0, 4.0, 4.0, 4.0, 4.0, 4.0, 10.0, 10.0, 4.0, 4.0]
    bumrah_maidens = [0, 1, 0, 0, 1, 0, 2, 0, 1, 1]
    
    # Pitch map coordinates generator
    # Areas: Good Length, Yorker, Full, Short, Short-Of-Length
    # Lines: Off Stump, Outside Off, Leg Stump, Middle Stump
    def make_pitch_map(wkts):
        import random
        random.seed(42 + wkts)
        items = []
        lengths = ["Good Length", "Yorker", "Full", "Short", "Short-Of-Length"]
        lines = ["Off Stump", "Outside Off", "Leg Stump", "Middle Stump"]
        
        # Deliveries mapped (say 24 balls in T20)
        for d in range(24):
            length = random.choice(lengths)
            line = random.choice(lines)
            is_wkt = False
            
            # Yorkers and good length have higher wicket chances
            if wkts > 0 and len([x for x in items if x["wicket"]]) < wkts:
                if length in ["Yorker", "Good Length"] and random.choice([True, False]):
                    is_wkt = True
                    
            items.append({
                "length": length,
                "line": line,
                "wicket": is_wkt,
                "x_coord": random.randint(10, 90), # Percentage representation
                "y_coord": random.randint(10, 90)
            })
            
        # Ensure exact wickets are mapped as wickets
        while len([x for x in items if x["wicket"]]) < wkts:
            node = random.choice(items)
            node["wicket"] = True
            
        return items

    for i in range(10):
        m_date = base_date + datetime.timedelta(days=i*7 + 3)
        pm = make_pitch_map(bumrah_wickets[i])
        logs_col.insert_one({
            "player_id": bumrah_id,
            "match_id": f"B_MATCH_{i+1}",
            "opponent": kohli_opponents[i],
            "venue": kohli_venues[i],
            "date": m_date,
            "match_type": "T20" if bumrah_overs[i] == 4.0 else "ODI",
            "batting": {
                "runs_scored": 2 if i == 4 else 0,
                "balls_faced": 5 if i == 4 else 0,
                "strike_rate": 40.0 if i == 4 else 0.0,
                "is_out": True,
                "dismissal_type": "Caught" if i == 4 else "Did Not Bat",
                "fours": 0, "sixes": 0, "dot_balls": 4 if i == 4 else 0,
                "wagon_wheel": []
            },
            "bowling": {
                "overs_bowled": bumrah_overs[i],
                "runs_conceded": bumrah_runs_con[i],
                "wickets_taken": bumrah_wickets[i],
                "economy_rate": round(bumrah_runs_con[i] / bumrah_overs[i], 2),
                "maidens": bumrah_maidens[i],
                "dot_balls": int(bumrah_overs[i] * 6 * 0.6), # 60% dot balls
                "pitch_map": pm
            },
            "fielding": { "catches": 0, "run_outs": 0, "stumpings": 0 }
        })

    # 4.5 Seed Mitchell Starc
    starc_id = seeded_players["Mitchell Starc"]
    starc_wickets = [3, 1, 4, 0, 2, 1, 3, 0, 2, 3]

    starc_runs_con = [35, 42, 28, 45, 32, 24, 52, 38, 22, 18]
    starc_overs = [4.0, 4.0, 10.0, 10.0, 4.0, 4.0, 10.0, 10.0, 4.0, 4.0]
    
    for i in range(10):
        m_date = base_date + datetime.timedelta(days=i*7 + 4)
        pm = make_pitch_map(starc_wickets[i])
        logs_col.insert_one({
            "player_id": starc_id,
            "match_id": f"ST_MATCH_{i+1}",
            "opponent": "England" if i % 2 == 0 else "India",
            "venue": "Lord's, London" if i % 2 == 0 else "MCG, Melbourne",
            "date": m_date,
            "match_type": "T20" if starc_overs[i] == 4.0 else "ODI",
            "batting": {
                "runs_scored": 12 if i == 3 else 0,
                "balls_faced": 10 if i == 3 else 0,
                "strike_rate": 120.0 if i == 3 else 0.0,
                "is_out": True,
                "dismissal_type": "Bowled",
                "fours": 1, "sixes": 0, "dot_balls": 5,
                "wagon_wheel": []
            },
            "bowling": {
                "overs_bowled": starc_overs[i],
                "runs_conceded": starc_runs_con[i],
                "wickets_taken": starc_wickets[i],
                "economy_rate": round(starc_runs_con[i] / starc_overs[i], 2),
                "maidens": 0,
                "dot_balls": int(starc_overs[i] * 6 * 0.45),
                "pitch_map": pm
            },
            "fielding": { "catches": 1 if i == 5 else 0, "run_outs": 0, "stumpings": 0 }
        })

    # 4.6 Seed Rashid Khan
    rashid_id = seeded_players["Rashid Khan"]
    rashid_wickets = [3, 2, 1, 2, 0, 4, 1, 2, 3, 2]
    rashid_runs_con = [20, 18, 25, 16, 28, 12, 30, 22, 15, 24]
    rashid_runs = [15, 2, 28, 0, 45, 12, 6, 32, 0, 18]
    rashid_balls = [8, 3, 14, 1, 22, 8, 4, 15, 2, 10]
    
    for i in range(10):
        m_date = base_date + datetime.timedelta(days=i*7 + 5)
        pm = make_pitch_map(rashid_wickets[i])
        ww = make_wagon_wheel(rashid_runs[i])
        logs_col.insert_one({
            "player_id": rashid_id,
            "match_id": f"RSH_MATCH_{i+1}",
            "opponent": kohli_opponents[i],
            "venue": kohli_venues[i],
            "date": m_date,
            "match_type": "T20" if i % 2 == 0 else "ODI",
            "batting": {
                "runs_scored": rashid_runs[i],
                "balls_faced": rashid_balls[i],
                "strike_rate": round(rashid_runs[i] / rashid_balls[i] * 100.0, 1) if rashid_balls[i] > 0 else 0.0,
                "is_out": True,
                "dismissal_type": "Caught",
                "fours": int(rashid_runs[i] * 0.1),
                "sixes": int(rashid_runs[i] * 0.08),
                "dot_balls": int(rashid_balls[i] * 0.3),
                "wagon_wheel": ww
            },
            "bowling": {
                "overs_bowled": 4.0,
                "runs_conceded": rashid_runs_con[i],
                "wickets_taken": rashid_wickets[i],
                "economy_rate": round(rashid_runs_con[i] / 4.0, 2),
                "maidens": 0,
                "dot_balls": int(4.0 * 6 * 0.55),
                "pitch_map": pm
            },
            "fielding": { "catches": 0, "run_outs": 0, "stumpings": 0 }
        })

    print("[Seed] Seeded match logs for all players successfully.")
    print("[Seed] Database seeding completed successfully.")

if __name__ == "__main__":
    seed_database()
