const fs = require('fs');
const path = require('path');

const MOCK_DB_DIR = path.join(__dirname);
const MOCK_DB_PATH = path.join(MOCK_DB_DIR, 'mock_db.json');

// Pre-calculated bcrypt hashes for "password123" to avoid npm bcrypt dependencies
const DEMO_PW_HASH = "$2b$12$R.S/mDNu1lZ9p.xJ65x6EuQxO.XjK2i68m3U1g1pL.zDSwV3xL7k6";

function generateMockDb() {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 100);

  const db = {
    users: [
      {
        _id: "u-admin-id",
        name: "Admin User",
        email: "admin@cricketinsight.com",
        password_hash: DEMO_PW_HASH,
        role: "ADMIN",
        is_verified: true,
        created_at: new Date().toISOString()
      },
      {
        _id: "u-analyst-id",
        name: "Head Analyst",
        email: "analyst@cricketinsight.com",
        password_hash: DEMO_PW_HASH,
        role: "ANALYST",
        is_verified: true,
        created_at: new Date().toISOString()
      },
      {
        _id: "u-fan-id",
        name: "Cricket Fan",
        email: "user@cricketinsight.com",
        password_hash: DEMO_PW_HASH,
        role: "USER",
        is_verified: true,
        created_at: new Date().toISOString()
      }
    ],
    players: [
      {
        _id: "p-kohli-id",
        name: "Virat Kohli",
        age: 37,
        country: "India",
        team: "Royal Challengers Bengaluru",
        role: "Batter",
        batting_style: "Right-hand bat",
        bowling_style: "Right-arm medium",
        image_url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=300&auto=format&fit=crop&q=80",
        scout_stats: {
          consistency_score: 94.5,
          pressure_index: 97.2,
          chase_score: 99.1,
          powerplay_eff: 82.4,
          death_overs_eff: 89.5,
          injury_status: "Healthy",
          injury_recovery_time: 0,
          market_value: 150000000
        }
      },
      {
        _id: "p-rohit-id",
        name: "Rohit Sharma",
        age: 38,
        country: "India",
        team: "Mumbai Indians",
        role: "Batter",
        batting_style: "Right-hand bat",
        bowling_style: "Right-arm offbreak",
        image_url: "https://images.unsplash.com/photo-1540747737956-378724044453?w=300&auto=format&fit=crop&q=80",
        scout_stats: {
          consistency_score: 86.8,
          pressure_index: 91.5,
          chase_score: 88.3,
          powerplay_eff: 94.1,
          death_overs_eff: 86.2,
          injury_status: "Healthy",
          injury_recovery_time: 0,
          market_value: 120000000
        }
      },
      {
        _id: "p-smith-id",
        name: "Steve Smith",
        age: 36,
        country: "Australia",
        team: "Sydney Sixers",
        role: "Batter",
        batting_style: "Right-hand bat",
        bowling_style: "Right-arm legbreak",
        image_url: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=300&auto=format&fit=crop&q=80",
        scout_stats: {
          consistency_score: 91.2,
          pressure_index: 93.8,
          chase_score: 85.4,
          powerplay_eff: 70.2,
          death_overs_eff: 78.4,
          injury_status: "Minor Strain",
          injury_recovery_time: 5,
          market_value: 80000000
        }
      },
      {
        _id: "p-bumrah-id",
        name: "Jasprit Bumrah",
        age: 32,
        country: "India",
        team: "Mumbai Indians",
        role: "Bowler",
        batting_style: "Right-hand bat",
        bowling_style: "Right-arm fast",
        image_url: "https://images.unsplash.com/photo-1629285483773-6b5cde2171d7?w=300&auto=format&fit=crop&q=80",
        scout_stats: {
          consistency_score: 96.7,
          pressure_index: 98.4,
          chase_score: 92.5,
          powerplay_eff: 93.0,
          death_overs_eff: 98.9,
          injury_status: "Healthy",
          injury_recovery_time: 0,
          market_value: 160000000
        }
      },
      {
        _id: "p-starc-id",
        name: "Mitchell Starc",
        age: 36,
        country: "Australia",
        team: "Kolkata Knight Riders",
        role: "Bowler",
        batting_style: "Left-hand bat",
        bowling_style: "Left-arm fast",
        image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
        scout_stats: {
          consistency_score: 82.5,
          pressure_index: 88.0,
          chase_score: 80.0,
          powerplay_eff: 89.2,
          death_overs_eff: 91.4,
          injury_status: "Healthy",
          injury_recovery_time: 0,
          market_value: 110000000
        }
      },
      {
        _id: "p-rashid-id",
        name: "Rashid Khan",
        age: 27,
        country: "Afghanistan",
        team: "Gujarat Titans",
        role: "All-Rounder",
        batting_style: "Right-hand bat",
        bowling_style: "Right-arm legbreak",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        scout_stats: {
          consistency_score: 93.1,
          pressure_index: 95.8,
          chase_score: 90.4,
          powerplay_eff: 88.5,
          death_overs_eff: 94.6,
          injury_status: "Healthy",
          injury_recovery_time: 0,
          market_value: 140000000
        }
      }
    ],
    matches: [
      {
        match_id: "M001",
        opponent_a: "India",
        opponent_b: "Pakistan",
        venue: "MCG, Melbourne",
        date: new Date(baseDate).toISOString(),
        match_type: "T20",
        summary: "India won by 4 wickets in a thrilling final-ball finish.",
        scorecard: {
          team_a: { runs: 160, wickets: 4, overs: 20.0, name: "India" },
          team_b: { runs: 159, wickets: 8, overs: 20.0, name: "Pakistan" }
        },
        partnerships: [
          { batter_1: "Virat Kohli", batter_2: "Hardik Pandya", runs: 113, balls: 78 },
          { batter_1: "KL Rahul", batter_2: "Rohit Sharma", runs: 10, balls: 12 }
        ],
        manhattan_data: {
          overs: Array.from({length: 20}, (_, i) => i + 1),
          team_a_runs: [4, 6, 3, 5, 2, 8, 4, 7, 10, 12, 11, 15, 6, 8, 14, 18, 12, 16, 15, 16],
          team_b_runs: [6, 8, 5, 4, 9, 3, 5, 6, 7, 8, 9, 11, 12, 7, 8, 10, 11, 12, 13, 9]
        }
      },
      {
        match_id: "M002",
        opponent_a: "India",
        opponent_b: "Australia",
        venue: "Narendra Modi Stadium, Ahmedabad",
        date: new Date(baseDate.getTime() + 10*24*60*60*1000).toISOString(),
        match_type: "ODI",
        summary: "Australia won by 6 wickets, clinching the series.",
        scorecard: {
          team_a: { runs: 240, wickets: 10, overs: 50.0, name: "India" },
          team_b: { runs: 241, wickets: 4, overs: 43.0, name: "Australia" }
        },
        partnerships: [
          { batter_1: "Travis Head", batter_2: "Marnus Labuschagne", runs: 192, balls: 215 },
          { batter_1: "Virat Kohli", batter_2: "KL Rahul", runs: 67, balls: 109 }
        ],
        manhattan_data: {
          overs: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
          team_a_runs: [30, 52, 78, 105, 130, 154, 178, 201, 222, 240],
          team_b_runs: [28, 45, 69, 98, 128, 160, 195, 225, 241, 0]
        }
      },
      {
        match_id: "M003",
        opponent_a: "Australia",
        opponent_b: "England",
        venue: "Lord's, London",
        date: new Date(baseDate.getTime() + 20*24*60*60*1000).toISOString(),
        match_type: "Test",
        summary: "Australia won by 43 runs in a tense Ashes encounter.",
        scorecard: {
          team_a: { runs: 416, wickets: 10, overs: 100.4, name: "Australia" },
          team_b: { runs: 373, wickets: 10, overs: 95.2, name: "England" }
        },
        partnerships: [
          { batter_1: "Steve Smith", batter_2: "Travis Head", runs: 118, balls: 180 },
          { batter_1: "Ben Stokes", batter_2: "Jonny Bairstow", runs: 85, balls: 112 }
        ],
        manhattan_data: {
          overs: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
          team_a_runs: [40, 85, 130, 172, 215, 255, 290, 340, 385, 416],
          team_b_runs: [35, 78, 115, 158, 192, 230, 274, 312, 350, 373]
        }
      }
    ],
    match_logs: []
  };

  // Helper to make mock wagon wheel scoring angles
  function makeWagonWheel(runs) {
    if (runs === 0) return [];
    const zones = [
      { area: "Cover", angle: 45 },
      { area: "Point", angle: 15 },
      { area: "Third-Man", angle: 315 },
      { area: "Mid-Off", angle: 90 },
      { area: "Mid-On", angle: 180 },
      { area: "Mid-Wicket", angle: 135 },
      { area: "Square-Leg", angle: 225 },
      { area: "Fine-Leg", angle: 270 }
    ];
    const items = [];
    let rem = runs;
    while (rem > 0) {
      let val = [1, 2, 4, 6][Math.floor(Math.random() * 4)];
      if (val > rem) val = rem;
      const zone = zones[Math.floor(Math.random() * zones.length)];
      items.push({
        angle: zone.angle + Math.floor(Math.random() * 30 - 15),
        runs: val,
        area: zone.area
      });
      rem -= val;
    }
    return items;
  }

  // Helper to make pitch map coordinates
  function makePitchMap(wkts) {
    const items = [];
    const lengths = ["Good Length", "Yorker", "Full", "Short", "Short-Of-Length"];
    const lines = ["Off Stump", "Outside Off", "Leg Stump", "Middle Stump"];
    
    for (let d = 0; d < 24; d++) {
      const length = lengths[Math.floor(Math.random() * lengths.length)];
      const line = lines[Math.floor(Math.random() * lines.length)];
      items.push({
        length: length,
        line: line,
        wicket: false,
        x_coord: Math.floor(Math.random() * 80 + 10),
        y_coord: Math.floor(Math.random() * 80 + 10)
      });
    }

    // Assign wickets
    let assigned = 0;
    while (assigned < wkts && items.length > 0) {
      const idx = Math.floor(Math.random() * items.length);
      if (!items[idx].wicket) {
        items[idx].wicket = true;
        assigned++;
      }
    }
    return items;
  }

  // 1. Kohli match logs
  const kohliRuns = [82, 54, 12, 101, 77, 4, 36, 117, 8, 49];
  const kohliBalls = [53, 38, 19, 61, 52, 9, 28, 95, 11, 32];
  const kohliOpps = ["Pakistan", "Australia", "England", "New Zealand", "South Africa", "Sri Lanka", "West Indies", "Bangladesh", "Afghanistan", "Pakistan"];
  
  for (let i = 0; i < 10; i++) {
    const mDate = new Date(baseDate);
    mDate.setDate(mDate.getDate() + i * 7);
    db.match_logs.push({
      _id: `log-kohli-${i}`,
      player_id: "p-kohli-id",
      match_id: `K_MATCH_${i+1}`,
      opponent: kohliOpps[i],
      venue: "Neutral Stadium",
      date: mDate.toISOString(),
      match_type: i % 2 === 0 ? "T20" : "ODI",
      batting: {
        runs_scored: kohliRuns[i],
        balls_faced: kohliBalls[i],
        strike_rate: parseFloat((kohliRuns[i] / kohliBalls[i] * 100).toFixed(1)),
        is_out: i !== 0 && i !== 3 && i !== 9,
        dismissal_type: (i === 0 || i === 3 || i === 9) ? "Not Out" : "Caught",
        fours: Math.floor(kohliRuns[i] * 0.08),
        sixes: Math.floor(kohliRuns[i] * 0.03),
        dot_balls: Math.floor(kohliBalls[i] * 0.35),
        wagon_wheel: makeWagonWheel(kohliRuns[i])
      },
      bowling: {
        overs_bowled: 0,
        runs_conceded: 0,
        wickets_taken: 0,
        economy_rate: 0,
        maidens: 0,
        dot_balls: 0,
        pitch_map: []
      },
      fielding: { catches: i % 3 === 0 ? 1 : 0, run_outs: 0, stumpings: 0 }
    });
  }

  // 2. Rohit match logs
  const rohitRuns = [28, 86, 0, 15, 121, 64, 40, 57, 8, 48];
  const rohitBalls = [15, 50, 2, 10, 69, 41, 21, 38, 5, 29];
  
  for (let i = 0; i < 10; i++) {
    const mDate = new Date(baseDate);
    mDate.setDate(mDate.getDate() + i * 7 + 1);
    db.match_logs.push({
      _id: `log-rohit-${i}`,
      player_id: "p-rohit-id",
      match_id: `R_MATCH_${i+1}`,
      opponent: kohliOpps[i],
      venue: "Neutral Ground",
      date: mDate.toISOString(),
      match_type: i % 2 === 0 ? "T20" : "ODI",
      batting: {
        runs_scored: rohitRuns[i],
        balls_faced: rohitBalls[i],
        strike_rate: parseFloat((rohitRuns[i] / rohitBalls[i] * 100).toFixed(1)),
        is_out: rohitRuns[i] !== 121,
        dismissal_type: rohitRuns[i] === 121 ? "Not Out" : "Caught",
        fours: Math.floor(rohitRuns[i] * 0.1),
        sixes: Math.floor(rohitRuns[i] * 0.07),
        dot_balls: Math.floor(rohitBalls[i] * 0.4),
        wagon_wheel: makeWagonWheel(rohitRuns[i])
      },
      bowling: {
        overs_bowled: 0,
        runs_conceded: 0,
        wickets_taken: 0,
        economy_rate: 0,
        maidens: 0,
        dot_balls: 0,
        pitch_map: []
      },
      fielding: { catches: 0, run_outs: i === 4 ? 1 : 0, stumpings: 0 }
    });
  }

  // 3. Steve Smith match logs
  const smithRuns = [35, 9, 80, 46, 110, 6, 74, 50, 21, 62];
  const smithBalls = [52, 12, 78, 65, 185, 8, 105, 71, 35, 89];
  
  for (let i = 0; i < 10; i++) {
    const mDate = new Date(baseDate);
    mDate.setDate(mDate.getDate() + i * 7 + 2);
    db.match_logs.push({
      _id: `log-smith-${i}`,
      player_id: "p-smith-id",
      match_id: `S_MATCH_${i+1}`,
      opponent: i % 2 === 0 ? "England" : "India",
      venue: "Ashes Ground",
      date: mDate.toISOString(),
      match_type: i % 3 === 0 ? "Test" : "ODI",
      batting: {
        runs_scored: smithRuns[i],
        balls_faced: smithBalls[i],
        strike_rate: parseFloat((smithRuns[i] / smithBalls[i] * 100).toFixed(1)),
        is_out: smithRuns[i] !== 80,
        dismissal_type: smithRuns[i] === 80 ? "Not Out" : "Caught",
        fours: Math.floor(smithRuns[i] * 0.08),
        sixes: Math.floor(smithRuns[i] * 0.01),
        dot_balls: Math.floor(smithBalls[i] * 0.55),
        wagon_wheel: makeWagonWheel(smithRuns[i])
      },
      bowling: {
        overs_bowled: 0,
        runs_conceded: 0,
        wickets_taken: 0,
        economy_rate: 0,
        maidens: 0,
        dot_balls: 0,
        pitch_map: []
      },
      fielding: { catches: i === 2 ? 2 : 0, run_outs: 0, stumpings: 0 }
    });
  }

  // 4. Bumrah match logs
  const bumrahWickets = [2, 4, 1, 0, 3, 2, 4, 1, 2, 3];
  const bumrahRunsCon = [18, 14, 25, 34, 10, 22, 19, 28, 12, 15];
  const bumrahOvers = [4, 4, 4, 4, 4, 4, 10, 10, 4, 4];
  const bumrahMaidens = [0, 1, 0, 0, 1, 0, 2, 0, 1, 1];
  
  for (let i = 0; i < 10; i++) {
    const mDate = new Date(baseDate);
    mDate.setDate(mDate.getDate() + i * 7 + 3);
    db.match_logs.push({
      _id: `log-bumrah-${i}`,
      player_id: "p-bumrah-id",
      match_id: `B_MATCH_${i+1}`,
      opponent: kohliOpps[i],
      venue: "Neutral Stadium",
      date: mDate.toISOString(),
      match_type: bumrahOvers[i] === 4 ? "T20" : "ODI",
      batting: {
        runs_scored: i === 4 ? 2 : 0,
        balls_faced: i === 4 ? 5 : 0,
        strike_rate: i === 4 ? 40.0 : 0.0,
        is_out: true,
        dismissal_type: i === 4 ? "Caught" : "Did Not Bat",
        fours: 0, sixes: 0, dot_balls: i === 4 ? 4 : 0,
        wagon_wheel: []
      },
      bowling: {
        overs_bowled: bumrahOvers[i],
        runs_conceded: bumrahRunsCon[i],
        wickets_taken: bumrahWickets[i],
        economy_rate: parseFloat((bumrahRunsCon[i] / bumrahOvers[i]).toFixed(2)),
        maidens: bumrahMaidens[i],
        dot_balls: Math.floor(bumrahOvers[i] * 6 * 0.6),
        pitch_map: makePitchMap(bumrahWickets[i])
      },
      fielding: { catches: 0, run_outs: 0, stumpings: 0 }
    });
  }

  // 5. Mitchell Starc match logs
  const starcWickets = [3, 1, 4, 0, 2, 1, 3, 0, 2, 3];
  const starcRunsCon = [35, 42, 28, 45, 32, 24, 52, 38, 22, 18];
  const starcOvers = [4, 4, 10, 10, 4, 4, 10, 10, 4, 4];
  
  for (let i = 0; i < 10; i++) {
    const mDate = new Date(baseDate);
    mDate.setDate(mDate.getDate() + i * 7 + 4);
    db.match_logs.push({
      _id: `log-starc-${i}`,
      player_id: "p-starc-id",
      match_id: `ST_MATCH_${i+1}`,
      opponent: i % 2 === 0 ? "England" : "India",
      venue: "Neutral Stadium",
      date: mDate.toISOString(),
      match_type: starcOvers[i] === 4 ? "T20" : "ODI",
      batting: {
        runs_scored: i === 3 ? 12 : 0,
        balls_faced: i === 3 ? 10 : 0,
        strike_rate: i === 3 ? 120.0 : 0.0,
        is_out: true,
        dismissal_type: "Bowled",
        fours: 1, sixes: 0, dot_balls: 5,
        wagon_wheel: []
      },
      bowling: {
        overs_bowled: starcOvers[i],
        runs_conceded: starcRunsCon[i],
        wickets_taken: starcWickets[i],
        economy_rate: parseFloat((starcRunsCon[i] / starcOvers[i]).toFixed(2)),
        maidens: 0,
        dot_balls: Math.floor(starcOvers[i] * 6 * 0.45),
        pitch_map: makePitchMap(starcWickets[i])
      },
      fielding: { catches: i === 5 ? 1 : 0, run_outs: 0, stumpings: 0 }
    });
  }

  // 6. Rashid Khan match logs
  const rashidWickets = [3, 2, 1, 2, 0, 4, 1, 2, 3, 2];
  const rashidRunsCon = [20, 18, 25, 16, 28, 12, 30, 22, 15, 24];
  const rashidRuns = [15, 2, 28, 0, 45, 12, 6, 32, 0, 18];
  const rashidBalls = [8, 3, 14, 1, 22, 8, 4, 15, 2, 10];
  
  for (let i = 0; i < 10; i++) {
    const mDate = new Date(baseDate);
    mDate.setDate(mDate.getDate() + i * 7 + 5);
    db.match_logs.push({
      _id: `log-rashid-${i}`,
      player_id: "p-rashid-id",
      match_id: `RSH_MATCH_${i+1}`,
      opponent: kohliOpps[i],
      venue: "Neutral Stadium",
      date: mDate.toISOString(),
      match_type: i % 2 === 0 ? "T20" : "ODI",
      batting: {
        runs_scored: rashidRuns[i],
        balls_faced: rashidBalls[i],
        strike_rate: parseFloat((rashidRuns[i] / rashidBalls[i] * 100).toFixed(1)),
        is_out: true,
        dismissal_type: "Caught",
        fours: Math.floor(rashidRuns[i] * 0.1),
        sixes: Math.floor(rashidRuns[i] * 0.08),
        dot_balls: Math.floor(rashidBalls[i] * 0.3),
        wagon_wheel: makeWagonWheel(rashidRuns[i])
      },
      bowling: {
        overs_bowled: 4,
        runs_conceded: rashidRunsCon[i],
        wickets_taken: rashidWickets[i],
        economy_rate: parseFloat((rashidRunsCon[i] / 4).toFixed(2)),
        maidens: 0,
        dot_balls: Math.floor(4 * 6 * 0.55),
        pitch_map: makePitchMap(rashidWickets[i])
      },
      fielding: { catches: 0, run_outs: 0, stumpings: 0 }
    });
  }

  // Create folder if missing
  if (!fs.existsSync(MOCK_DB_DIR)) {
    fs.mkdirSync(MOCK_DB_DIR, { recursive: true });
  }

  // Write file
  fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  console.log(`[Seed Node] Success! Created pre-populated JSON mock database at: ${MOCK_DB_PATH}`);
}

generateMockDb();
