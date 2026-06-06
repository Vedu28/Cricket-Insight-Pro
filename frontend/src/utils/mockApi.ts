// Client-Side Mock Database and Analytics Simulator for Offline Execution

const DEMO_PLAYERS = [
  {
    id: "p-kohli-id",
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
    id: "p-rohit-id",
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
    id: "p-smith-id",
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
    id: "p-bumrah-id",
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
    id: "p-starc-id",
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
    id: "p-rashid-id",
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
];

const DEMO_MATCHES = [
  {
    match_id: "M001",
    opponent_a: "India",
    opponent_b: "Pakistan",
    venue: "MCG, Melbourne",
    date: new Date(Date.now() - 100 * 24 * 3600 * 1000).toISOString(),
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
    date: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
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
    date: new Date(Date.now() - 80 * 24 * 3600 * 1000).toISOString(),
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
];

// Re-generate match logs locally
const MOCK_DB_LOGS: any[] = [];
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

function makeWagonWheel(runs: number) {
  if (runs === 0) return [];
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

function makePitchMap(wkts: number) {
  const items = [];
  const lengths = ["Good Length", "Yorker", "Full", "Short", "Short-Of-Length"];
  const lines = ["Off Stump", "Outside Off", "Leg Stump", "Middle Stump"];
  
  for (let d = 0; d < 24; d++) {
    items.push({
      length: lengths[Math.floor(Math.random() * lengths.length)],
      line: lines[Math.floor(Math.random() * lines.length)],
      wicket: false,
      x_coord: Math.floor(Math.random() * 80 + 10),
      y_coord: Math.floor(Math.random() * 80 + 10)
    });
  }
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

// Seeding match logs for Kohli
const kohliRuns = [82, 54, 12, 101, 77, 4, 36, 117, 8, 49];
const kohliBalls = [53, 38, 19, 61, 52, 9, 28, 95, 11, 32];
const kohliOpps = ["Pakistan", "Australia", "England", "New Zealand", "South Africa", "Sri Lanka", "West Indies", "Bangladesh", "Afghanistan", "Pakistan"];

for (let i = 0; i < 10; i++) {
  MOCK_DB_LOGS.push({
    player_id: "p-kohli-id",
    match_id: `K_MATCH_${i+1}`,
    opponent: kohliOpps[i],
    venue: "Neutral Stadium",
    date: new Date(Date.now() - (10 - i) * 7 * 24 * 3600 * 1000).toISOString(),
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
    bowling: { overs_bowled: 0, runs_conceded: 0, wickets_taken: 0, economy_rate: 0, maidens: 0, dot_balls: 0, pitch_map: [] },
    fielding: { catches: i % 3 === 0 ? 1 : 0, run_outs: 0, stumpings: 0 }
  });
}

// Seeding match logs for Rohit
const rohitRuns = [28, 86, 0, 15, 121, 64, 40, 57, 8, 48];
const rohitBalls = [15, 50, 2, 10, 69, 41, 21, 38, 5, 29];
for (let i = 0; i < 10; i++) {
  MOCK_DB_LOGS.push({
    player_id: "p-rohit-id",
    match_id: `R_MATCH_${i+1}`,
    opponent: kohliOpps[i],
    venue: "Neutral Ground",
    date: new Date(Date.now() - (10 - i) * 7 * 24 * 3600 * 1000).toISOString(),
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
    bowling: { overs_bowled: 0, runs_conceded: 0, wickets_taken: 0, economy_rate: 0, maidens: 0, dot_balls: 0, pitch_map: [] },
    fielding: { catches: 0, run_outs: i === 4 ? 1 : 0, stumpings: 0 }
  });
}

// Seeding match logs for Steve Smith
const smithRuns = [35, 9, 80, 46, 110, 6, 74, 50, 21, 62];
const smithBalls = [52, 12, 78, 65, 185, 8, 105, 71, 35, 89];
for (let i = 0; i < 10; i++) {
  MOCK_DB_LOGS.push({
    player_id: "p-smith-id",
    match_id: `S_MATCH_${i+1}`,
    opponent: i % 2 === 0 ? "England" : "India",
    venue: "Ashes Ground",
    date: new Date(Date.now() - (10 - i) * 7 * 24 * 3600 * 1000).toISOString(),
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
    bowling: { overs_bowled: 0, runs_conceded: 0, wickets_taken: 0, economy_rate: 0, maidens: 0, dot_balls: 0, pitch_map: [] },
    fielding: { catches: i === 2 ? 2 : 0, run_outs: 0, stumpings: 0 }
  });
}

// Seeding match logs for Bumrah
const bumrahWkts = [2, 4, 1, 0, 3, 2, 4, 1, 2, 3];
const bumrahRunsCon = [18, 14, 25, 34, 10, 22, 19, 28, 12, 15];
const bumrahOvers = [4, 4, 4, 4, 4, 4, 10, 10, 4, 4];
for (let i = 0; i < 10; i++) {
  MOCK_DB_LOGS.push({
    player_id: "p-bumrah-id",
    match_id: `B_MATCH_${i+1}`,
    opponent: kohliOpps[i],
    venue: "Neutral Ground",
    date: new Date(Date.now() - (10 - i) * 7 * 24 * 3600 * 1000).toISOString(),
    match_type: bumrahOvers[i] === 4 ? "T20" : "ODI",
    batting: { runs_scored: 0, balls_faced: 0, strike_rate: 0, is_out: true, dismissal_type: "Did Not Bat", fours: 0, sixes: 0, dot_balls: 0, wagon_wheel: [] },
    bowling: {
      overs_bowled: bumrahOvers[i],
      runs_conceded: bumrahRunsCon[i],
      wickets_taken: bumrahWkts[i],
      economy_rate: parseFloat((bumrahRunsCon[i] / bumrahOvers[i]).toFixed(2)),
      maidens: i === 1 || i === 4 || i === 9 ? 1 : 0,
      dot_balls: Math.floor(bumrahOvers[i] * 6 * 0.6),
      pitch_map: makePitchMap(bumrahWkts[i])
    },
    fielding: { catches: 0, run_outs: 0, stumpings: 0 }
  });
}

// Seeding match logs for Starc
const starcWkts = [3, 1, 4, 0, 2, 1, 3, 0, 2, 3];
const starcRunsCon = [35, 42, 28, 45, 32, 24, 52, 38, 22, 18];
const starcOvers = [4, 4, 10, 10, 4, 4, 10, 10, 4, 4];
for (let i = 0; i < 10; i++) {
  MOCK_DB_LOGS.push({
    player_id: "p-starc-id",
    match_id: `ST_MATCH_${i+1}`,
    opponent: i % 2 === 0 ? "England" : "India",
    date: new Date(Date.now() - (10 - i) * 7 * 24 * 3600 * 1000).toISOString(),
    match_type: starcOvers[i] === 4 ? "T20" : "ODI",
    batting: { runs_scored: 0, balls_faced: 0, strike_rate: 0, is_out: true, dismissal_type: "Did Not Bat", fours: 0, sixes: 0, dot_balls: 0, wagon_wheel: [] },
    bowling: {
      overs_bowled: starcOvers[i],
      runs_conceded: starcRunsCon[i],
      wickets_taken: starcWkts[i],
      economy_rate: parseFloat((starcRunsCon[i] / starcOvers[i]).toFixed(2)),
      maidens: 0,
      dot_balls: Math.floor(starcOvers[i] * 6 * 0.45),
      pitch_map: makePitchMap(starcWkts[i])
    },
    fielding: { catches: i === 5 ? 1 : 0, run_outs: 0, stumpings: 0 }
  });
}

// Seeding match logs for Rashid
const rashidWkts = [3, 2, 1, 2, 0, 4, 1, 2, 3, 2];
const rashidRunsCon = [20, 18, 25, 16, 28, 12, 30, 22, 15, 24];
const rashidRuns = [15, 2, 28, 0, 45, 12, 6, 32, 0, 18];
const rashidBalls = [8, 3, 14, 1, 22, 8, 4, 15, 2, 10];
for (let i = 0; i < 10; i++) {
  MOCK_DB_LOGS.push({
    player_id: "p-rashid-id",
    match_id: `RSH_MATCH_${i+1}`,
    opponent: kohliOpps[i],
    date: new Date(Date.now() - (10 - i) * 7 * 24 * 3600 * 1000).toISOString(),
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
      overs_bowled: 4.0,
      runs_conceded: rashidRunsCon[i],
      wickets_taken: rashidWkts[i],
      economy_rate: parseFloat((rashidRunsCon[i] / 4.0).toFixed(2)),
      maidens: 0,
      dot_balls: Math.floor(4.0 * 6 * 0.55),
      pitch_map: makePitchMap(rashidWkts[i])
    },
    fielding: { catches: 0, run_outs: 0, stumpings: 0 }
  });
}

// Client ML execution logic
function runClientPrediction(playerId: string, algo: string) {
  const logs = MOCK_DB_LOGS.filter(l => l.player_id === playerId);
  const runs = logs.map(l => l.batting.runs_scored || 0);
  const wkts = logs.map(l => l.bowling.wickets_taken || 0);
  const srs = logs.map(l => l.batting.strike_rate || 0);
  
  const n = logs.length;
  
  // Math regression fallbacks
  let predRuns = 35;
  let predWkts = 0.5;
  let predSr = 120;
  
  if (n > 0) {
    const sumRuns = runs.reduce((a,b)=>a+b,0);
    const sumWkts = wkts.reduce((a,b)=>a+b,0);
    const sumSrs = srs.reduce((a,b)=>a+b,0);
    
    const meanRuns = sumRuns / n;
    const meanWkts = sumWkts / n;
    const meanSrs = sumSrs / n;
    
    // Add small momentum factor
    const slopeRuns = n >= 2 ? (runs[n-1] - runs[0]) / n : 0;
    const slopeWkts = n >= 2 ? (wkts[n-1] - wkts[0]) / n : 0;
    
    if (algo === 'linear_regression') {
      predRuns = meanRuns + slopeRuns * 0.5;
      predWkts = meanWkts + slopeWkts * 0.5;
    } else if (algo === 'lstm') {
      // Exponential sequence weights
      let wSum = 0;
      let rSum = 0;
      for (let i = 0; i < n; i++) {
        const w = Math.pow(0.85, n - i - 1);
        rSum += runs[i] * w;
        wSum += w;
      }
      predRuns = rSum / wSum;
      predWkts = meanWkts + (wkts[n-1] - meanWkts) * 0.4;
    } else { // random_forest or xgboost
      predRuns = meanRuns + (runs[n-1] - meanRuns) * 0.2;
      predWkts = meanWkts;
    }
  }
  
  predRuns = Math.max(0, parseFloat(predRuns.toFixed(1)));
  predWkts = Math.max(0, parseFloat(predWkts.toFixed(1)));
  predSr = Math.max(50, parseFloat(predSr.toFixed(1)));
  
  // Generate 5 forecast points
  const forecast = [];
  let curr = predRuns;
  for (let i = 0; i < 5; i++) {
    curr = 0.9 * curr + 0.1 * 40 + (Math.random() * 4 - 2);
    forecast.push(parseFloat(Math.max(0, curr).toFixed(1)));
  }

  return {
    expected_runs: predRuns,
    expected_wickets: predWkts,
    expected_strike_rate: predSr,
    confidence_score: algo === 'lstm' ? 86 : algo === 'xgboost' ? 82 : 75,
    form_prediction: predRuns > 50 ? "Hot" : predRuns < 20 ? "Poor" : "Average",
    forecast_trend: forecast,
    confidence_interval: { min_runs: Math.max(0, Math.floor(predRuns - 15)), max_runs: Math.floor(predRuns + 15) }
  };
}

// Client AI Chat NLP Matcher
function runClientChat(message: string) {
  const msg = message.toLowerCase();
  
  // Resolve player mentions
  const matched: any[] = [];
  DEMO_PLAYERS.forEach(p => {
    const pName = p.name.toLowerCase();
    const lName = pName.split(" ").pop() || "";
    if (msg.includes(pName) || msg.includes(lName)) {
      matched.push(p);
    }
  });

  if (msg.includes("compare") || msg.includes("better") || msg.includes("vs")) {
    if (matched.length >= 2) {
      const p1 = matched[0];
      const p2 = matched[1];
      const p1Cons = p1.scout_stats.consistency_score;
      const p2Cons = p2.scout_stats.consistency_score;
      
      let text = `Sure! Let's compare **${p1.name}** vs **${p2.name}**:\n\n`;
      text += `- **Consistency Rating**: ${p1.name} (${p1Cons}%) vs ${p2.name} (${p2Cons}%)\n`;
      text += `- **Role**: ${p1.name} (${p1.role}) vs ${p2.name} (${p2.role})\n`;
      text += `- **Franchise**: ${p1.name} (${p1.team}) vs ${p2.name} (${p2.team})\n\n`;
      text += `**AI Client Insight**: ${p1Cons > p2Cons ? p1.name : p2.name} displays higher consistency ratings in our historical logs.`;
      return text;
    }
    return "I would love to compare, but I couldn't identify two players. Try: 'Compare Kohli and Smith'.";
  }

  if (msg.includes("predict") || msg.includes("next score") || msg.includes("forecast")) {
    if (matched.length >= 1) {
      const p = matched[0];
      const pred = runClientPrediction(p.id, "lstm");
      let text = `**AI Client Forecast for ${p.name} next match (LSTM RNN model)**:\n\n`;
      text += `- **Expected Runs**: ${pred.expected_runs}\n`;
      text += `- **Expected Wickets**: ${pred.expected_wickets}\n`;
      text += `- **Expected Strike Rate**: ${pred.expected_strike_rate}\n`;
      text += `- **Form Trajectory**: ${pred.form_prediction} Form\n`;
      text += `- **Model Confidence**: ${pred.confidence_score}%\n\n`;
      text += `**AI Client Insight**: ${p.name} is forecasted to maintain stable scoring options with ${pred.confidence_score}% probability.`;
      return text;
    }
    return "I couldn't identify the player. Try: 'Predict Kohli's next score'.";
  }

  if (matched.length >= 1) {
    const p = matched[0];
    let text = `Here is the profile review for **${p.name}**:\n`;
    text += `- **Role**: ${p.role} (${p.batting_style})\n`;
    text += `- **Nation**: ${p.country}\n`;
    text += `- **Estimated Valuation**: ₹${(p.scout_stats.market_value / 10000000).toFixed(2)} Cr\n`;
    text += `- **Consistency Rating**: ${p.scout_stats.consistency_score}%\n\n`;
    text += `**AI Client Insight**: ${p.name} is in **${p.scout_stats.consistency_score > 90 ? 'excellent' : 'steady'}** form and remains a key draft option.`;
    return text;
  }

  return "I couldn't identify any players in your query. I know about: Virat Kohli, Rohit Sharma, Steve Smith, Jasprit Bumrah, Mitchell Starc, and Rashid Khan. Try asking about their stats, comparisons, or match predictions!";
}

// Intercept fetch requests and route to simulated responses if backend offline
export async function mockFetch(url: string, options: any = {}): Promise<any> {
  const path = url.replace(/https?:\/\/[^\/]+/, '');
  console.warn(`[Client Sandbox Mode] Intercepting path: ${path}`);

  // Helpers to wrap response mock objects
  const jsonResponse = (data: any, status = 200) => {
    return {
      ok: status >= 200 && status < 300,
      status: status,
      json: async () => data
    };
  };

  // 1. Auth routes
  if (path.startsWith('/api/auth/me')) {
    return jsonResponse({
      user: { id: "u-analyst-id", name: "Guest Analyst (Sandbox)", email: "analyst@cricketinsight.com", role: "ADMIN", is_verified: true }
    });
  }
  if (path.startsWith('/api/auth/login')) {
    return jsonResponse({
      token: "sandbox-jwt-token-123456",
      user: { id: "u-analyst-id", name: "Guest Analyst (Sandbox)", email: "analyst@cricketinsight.com", role: "ADMIN" }
    });
  }
  if (path.startsWith('/api/auth/register')) {
    return jsonResponse({
      token: "sandbox-jwt-token-123456",
      user: { id: "u-analyst-id", name: "Guest Analyst (Sandbox)", email: "analyst@cricketinsight.com", role: "ADMIN" }
    });
  }

  // 2. Player routes
  if (path === '/api/players') {
    const list = DEMO_PLAYERS.map(p => {
      const logs = MOCK_DB_LOGS.filter(l => l.player_id === p.id);
      const runs = logs.reduce((sum, l) => sum + l.batting.runs_scored, 0);
      const wkts = logs.reduce((sum, l) => sum + l.bowling.wickets_taken, 0);
      return {
        ...p,
        match_count: logs.length,
        total_runs: runs,
        total_wickets: wkts
      };
    });
    return jsonResponse(list);
  }

  if (path.match(/\/api\/players\/p-[a-z]+-id\/matches/)) {
    const pId = path.split('/')[3];
    const logs = MOCK_DB_LOGS.filter(l => l.player_id === pId);
    return jsonResponse(logs);
  }

  if (path.match(/\/api\/players\/p-[a-z]+-id/)) {
    const pId = path.split('/')[3];
    const player = DEMO_PLAYERS.find(p => p.id === pId);
    if (!player) return jsonResponse({ message: "Not found" }, 404);
    
    const logs = MOCK_DB_LOGS.filter(l => l.player_id === pId);
    
    // Compute aggregates
    const runsList = logs.map(l => l.batting.runs_scored);
    const wktsList = logs.map(l => l.bowling.wickets_taken);
    const ballsList = logs.map(l => l.batting.balls_faced);
    const foursList = logs.map(l => l.batting.fours);
    const sixesList = logs.map(l => l.batting.sixes);
    const dotsList = logs.map(l => l.batting.dot_balls);
    
    const totRuns = runsList.reduce((a,b)=>a+b, 0);
    const totBalls = ballsList.reduce((a,b)=>a+b, 0);
    const totWkts = wktsList.reduce((a,b)=>a+b, 0);
    const avg = runsList.length > 0 ? (totRuns / runsList.length).toFixed(2) : "0.00";
    const sr = totBalls > 0 ? (totRuns / totBalls * 100).toFixed(2) : "0.00";
    
    const pmList: any[] = [];
    const wwList: any[] = [];
    logs.forEach(l => {
      if (l.bowling.pitch_map) pmList.push(...l.bowling.pitch_map);
      if (l.batting.wagon_wheel) wwList.push(...l.batting.wagon_wheel);
    });

    const wagonWheelSummary: any = {};
    wwList.forEach(w => {
      wagonWheelSummary[w.area] = (wagonWheelSummary[w.area] || 0) + w.runs;
    });

    const pitchMapSummary: any = {};
    pmList.forEach(p => {
      pitchMapSummary[p.length] = (pitchMapSummary[p.length] || 0) + 1;
    });

    return jsonResponse({
      ...player,
      career_stats: {
        batting: {
          innings: runsList.length,
          runs: totRuns,
          average: avg,
          strike_rate: sr,
          highest_score: Math.max(...runsList, 0),
          fifties: runsList.filter(r => r >= 50 && r < 100).length,
          hundreds: runsList.filter(r => r >= 100).length,
          fours: foursList.reduce((a,b)=>a+b,0),
          sixes: sixesList.reduce((a,b)=>a+b,0),
          dot_ball_percentage: totBalls > 0 ? (dotsList.reduce((a,b)=>a+b,0) / totBalls * 100).toFixed(1) : "0.0",
          boundary_percentage: totRuns > 0 ? (((foursList.reduce((a,b)=>a+b,0)*4 + sixesList.reduce((a,b)=>a+b,0)*6) / totRuns)*100).toFixed(1) : "0.0"
        },
        bowling: {
          matches: logs.filter(l => l.bowling.overs_bowled > 0).length,
          wickets: totWkts,
          economy: 7.2,
          average: totWkts > 0 ? (180 / totWkts).toFixed(2) : "0.00",
          strike_rate: totWkts > 0 ? (150 / totWkts).toFixed(2) : "0.0",
          best_figures: "4/14",
          maidens: 2,
          dot_ball_percentage: "55.0"
        },
        fielding: { catches: 4, run_outs: 1, stumpings: 0 }
      },
      recent_form: runsList.slice(0, 5).map((r, idx) => ({ match: `Opponent ${idx+1}`, value: r, type: "Runs" })),
      wagon_wheel: wwList,
      wagon_wheel_summary: Object.keys(wagonWheelSummary).map(k => ({ area: k, runs: wagonWheelSummary[k] })),
      pitch_map: pmList,
      pitch_map_summary: Object.keys(pitchMapSummary).map(k => ({ length: k, count: pitchMapSummary[k] }))
    });
  }

  // 3. Match routes
  if (path === '/api/matches') {
    return jsonResponse(DEMO_MATCHES);
  }
  if (path.startsWith('/api/matches/')) {
    const mId = path.split('/')[3];
    const match = DEMO_MATCHES.find(m => m.match_id === mId) || DEMO_MATCHES[0];
    return jsonResponse(match);
  }

  // 4. ML Predictions
  if (path.startsWith('/api/predictions')) {
    const params = new URLSearchParams(path.split('?')[1]);
    const playerId = params.get('player_id') || "p-kohli-id";
    const algo = params.get('algorithm') || "lstm";
    const pred = runClientPrediction(playerId, algo);
    return jsonResponse({
      predictions: pred
    });
  }

  // 5. Insights
  if (path.startsWith('/api/insights/chat')) {
    const body = JSON.parse(options.body || '{}');
    const reply = runClientChat(body.message || "");
    return jsonResponse({ response: reply });
  }

  if (path.startsWith('/api/insights/fantasy')) {
    const sorted = [...DEMO_PLAYERS].sort((a,b)=>b.scout_stats.consistency_score - a.scout_stats.consistency_score);
    return jsonResponse({
      best_eleven: sorted.map(p => ({
        id: p.id,
        name: p.name,
        role: p.role,
        team: p.team,
        consistency_score: p.scout_stats.consistency_score
      })),
      captain: {
        id: sorted[0].id,
        name: sorted[0].name,
        consistency_score: sorted[0].scout_stats.consistency_score,
        reason: `Captain selected due to highest career consistency index (${sorted[0].scout_stats.consistency_score}%) in offline matches.`
      },
      vice_captain: {
        id: sorted[1].id,
        name: sorted[1].name,
        consistency_score: sorted[1].scout_stats.consistency_score,
        reason: "Vice captain selected based on secondary high pressure play index."
      }
    });
  }

  if (path.startsWith('/api/insights/auction')) {
    return jsonResponse(DEMO_PLAYERS.map(p => ({
      player_id: p.id,
      name: p.name,
      role: p.role,
      age: p.age,
      consistency: p.scout_stats.consistency_score,
      market_value_actual: p.scout_stats.market_value,
      predicted_market_value: p.scout_stats.market_value + (Math.random()*10000000 - 5000000),
      formatted_predicted_value: `₹${(p.scout_stats.market_value / 10000000).toFixed(2)} Cr`
    })));
  }

  if (path.startsWith('/api/insights/injury')) {
    const body = JSON.parse(options.body || '{}');
    const p = DEMO_PLAYERS.find(pl => pl.id === body.player_id) || DEMO_PLAYERS[0];
    return jsonResponse({
      player_id: p.id,
      player_name: p.name,
      role: p.role,
      impact_score_reduction_percent: 22.5,
      simulation_report: `Losing ${p.name} reduces squad batting power by 22.5%. Expected team strike rate drops by 14% and chasing power index is significantly hindered.`,
      recovery_estimate_days: 14
    });
  }

  // 6. Scouting & rankings
  if (path.startsWith('/api/scouting/rankings')) {
    return jsonResponse({
      batting: [
        { player_id: "p-kohli-id", name: "Virat Kohli", team: "RCB", runs: 541, average: "54.10", strike_rate: "135.5", consistency: 94 },
        { player_id: "p-rohit-id", name: "Rohit Sharma", team: "MI", runs: 413, average: "41.30", strike_rate: "145.0", consistency: 86 },
        { player_id: "p-smith-id", name: "Steve Smith", team: "Sixers", runs: 493, average: "49.30", strike_rate: "115.0", consistency: 91 }
      ],
      bowling: [
        { player_id: "p-bumrah-id", name: "Jasprit Bumrah", team: "MI", wickets: 22, economy: "6.20", consistency: 96 },
        { player_id: "p-starc-id", name: "Mitchell Starc", team: "KKR", wickets: 19, economy: "8.40", consistency: 82 },
        { player_id: "p-rashid-id", name: "Rashid Khan", team: "GT", wickets: 20, economy: "6.70", consistency: 93 }
      ]
    });
  }

  if (path.startsWith('/api/scouting/talents')) {
    return jsonResponse([
      { player_id: "p-rashid-id", name: "Rashid Khan", age: 27, country: "Afghanistan", role: "All-Rounder", team: "GT", consistency: 93, pressure_index: 95 }
    ]);
  }

  return jsonResponse({ message: "Mock API Match" });
}
