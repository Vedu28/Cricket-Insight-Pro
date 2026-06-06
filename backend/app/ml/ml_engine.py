import numpy as np
import pandas as pd
from datetime import datetime
from app.database import get_db

class MLEngine:
    @staticmethod
    def get_player_match_history(player_id):
        db = get_db()
        logs = db["match_logs"].find({"player_id": player_id})
        
        # Sort logs by date (chronological order)
        def get_date(log):
            dt = log.get("date")
            if isinstance(dt, str):
                try:
                    return datetime.fromisoformat(dt.replace("Z", "+00:00"))
                except:
                    return datetime.min
            elif isinstance(dt, datetime):
                return dt
            return datetime.min
            
        logs = sorted(logs, key=get_date)
        return logs

    @classmethod
    def predict_next_match(cls, player_id, algorithm="linear_regression"):
        logs = cls.get_player_match_history(player_id)
        if not logs or len(logs) < 3:
            # Not enough data for meaningful prediction, return defaults
            return {
                "expected_runs": 30.0,
                "expected_wickets": 0.5,
                "expected_strike_rate": 110.0,
                "confidence_score": 50,
                "form_prediction": "Average",
                "forecast_trend": [30.0] * 5,
                "confidence_interval": {"min_runs": 10, "max_runs": 50}
            }

        # Extract stats lists
        runs = []
        balls = []
        wickets = []
        overs = []
        sr_list = []
        econ_list = []
        
        for log in logs:
            bat = log.get("batting", {})
            bowl = log.get("bowling", {})
            
            runs.append(float(bat.get("runs_scored", 0)))
            balls.append(float(bat.get("balls_faced", 0)))
            wickets.append(float(bowl.get("wickets_taken", 0)))
            overs.append(float(bowl.get("overs_bowled", 0)))
            
            # Strike rate & economy calculation
            r_val = float(bat.get("runs_scored", 0))
            b_val = float(bat.get("balls_faced", 0))
            sr_val = (r_val / b_val * 100.0) if b_val > 0 else 0.0
            sr_list.append(sr_val)
            
            run_con = float(bowl.get("runs_conceded", 0))
            ov_bowled = float(bowl.get("overs_bowled", 0))
            ec_val = (run_con / ov_bowled) if ov_bowled > 0 else 0.0
            econ_list.append(ec_val)

        # Decide role based on logs
        avg_runs = sum(runs) / len(runs)
        avg_wickets = sum(wickets) / len(wickets)
        is_bowler = avg_wickets > 0.8 and avg_runs < 20.0

        n = len(logs)
        x = np.arange(1, n + 1)

        # Run selected algorithm
        if algorithm == "linear_regression":
            pred_runs, pred_wkt, pred_sr, trend_runs = cls._fit_linear_regression(x, runs, wickets, sr_list, n)
            conf = 72
        elif algorithm == "random_forest":
            pred_runs, pred_wkt, pred_sr, trend_runs = cls._fit_random_forest(x, runs, wickets, sr_list, n)
            conf = 78
        elif algorithm == "xgboost":
            pred_runs, pred_wkt, pred_sr, trend_runs = cls._fit_xgboost(x, runs, wickets, sr_list, n)
            conf = 81
        elif algorithm == "lstm":
            pred_runs, pred_wkt, pred_sr, trend_runs = cls._fit_lstm(x, runs, wickets, sr_list, n)
            conf = 85
        else:
            pred_runs, pred_wkt, pred_sr, trend_runs = cls._fit_linear_regression(x, runs, wickets, sr_list, n)
            conf = 70

        # Adjust values for realistic caps
        pred_runs = max(0.0, round(pred_runs, 1))
        pred_wkt = max(0.0, round(pred_wkt, 1))
        pred_sr = max(30.0, round(pred_sr, 1))
        trend_runs = [max(0.0, round(v, 1)) for v in trend_runs]

        if is_bowler:
            pred_runs = min(pred_runs, 25.0)
            trend_runs = [min(v, 25.0) for v in trend_runs]
        else:
            pred_wkt = min(pred_wkt, 2.0)

        # Form analysis based on recent matches
        recent_5 = runs[-5:] if n >= 5 else runs
        recent_avg = sum(recent_5) / len(recent_5)
        overall_avg = sum(runs) / len(runs)
        
        if recent_avg > overall_avg * 1.15:
            form = "Hot"
            conf += 5
        elif recent_avg < overall_avg * 0.85:
            form = "Poor"
            conf -= 5
        else:
            form = "Average"
            
        conf = min(95, max(45, conf))

        # Confidence Interval (standard deviation bounds)
        std_runs = max(5.0, np.std(runs))
        min_runs = max(0, int(pred_runs - 0.7 * std_runs))
        max_runs = int(pred_runs + 0.7 * std_runs)

        return {
            "expected_runs": pred_runs,
            "expected_wickets": pred_wkt,
            "expected_strike_rate": pred_sr,
            "confidence_score": conf,
            "form_prediction": form,
            "forecast_trend": trend_runs,
            "confidence_interval": {"min_runs": min_runs, "max_runs": max_runs}
        }

    @staticmethod
    def _fit_linear_regression(x, runs, wickets, sr, n):
        # Solves y = mx + c using Ordinary Least Squares
        def ols(y_list):
            y = np.array(y_list)
            x_mean = np.mean(x)
            y_mean = np.mean(y)
            num = np.sum((x - x_mean) * (y - y_mean))
            den = np.sum((x - x_mean) ** 2)
            if den == 0:
                return 0.0, y_mean
            m = num / den
            c = y_mean - m * x_mean
            return m, c

        m_runs, c_runs = ols(runs)
        m_wkt, c_wkt = ols(wickets)
        m_sr, c_sr = ols(sr)

        # Predict next 5 matches (N+1 to N+5)
        pred_runs = m_runs * (n + 1) + c_runs
        pred_wkt = m_wkt * (n + 1) + c_wkt
        pred_sr = m_sr * (n + 1) + c_sr

        trend_runs = []
        for i in range(1, 6):
            trend_runs.append(max(0.0, m_runs * (n + i) + c_runs))

        return pred_runs, pred_wkt, pred_sr, trend_runs

    @staticmethod
    def _fit_random_forest(x, runs, wickets, sr, n):
        # Simulates bagging ensemble of trees.
        # It takes random bootstrap samples of historical data, computes predictions, and averages them.
        np.random.seed(42)
        runs_bag = []
        wkt_bag = []
        sr_bag = []
        
        # Sub-sample size is 70% of historical length
        sample_size = max(2, int(n * 0.7))
        for _ in range(10): # 10 trees
            indices = np.random.choice(n, size=sample_size, replace=True)
            # Evaluate weighted mean skewed towards recent matches
            recency_weights = np.linspace(0.8, 1.5, sample_size)
            
            runs_sample = [runs[idx] for idx in indices]
            wkt_sample = [wickets[idx] for idx in indices]
            sr_sample = [sr[idx] for idx in indices]
            
            runs_bag.append(np.average(runs_sample, weights=recency_weights))
            wkt_bag.append(np.average(wkt_sample, weights=recency_weights))
            sr_bag.append(np.average(sr_sample, weights=recency_weights))

        pred_runs = np.mean(runs_bag)
        pred_wkt = np.mean(wkt_bag)
        pred_sr = np.mean(sr_bag)

        # Generate a trend line
        trend_runs = []
        curr_pred = pred_runs
        for i in range(1, 6):
            # Slowly decay prediction towards overall running mean (regression to the mean)
            curr_pred = 0.8 * curr_pred + 0.2 * np.mean(runs)
            # Add small random noise to represent variance
            noise = np.random.normal(0, 1.5)
            trend_runs.append(max(0.0, curr_pred + noise))

        return pred_runs, pred_wkt, pred_sr, trend_runs

    @staticmethod
    def _fit_xgboost(x, runs, wickets, sr, n):
        # Simulates gradient boosting: fits a baseline mean, calculates residuals (errors),
        # fits secondary models on residuals, and adds them.
        
        def boost_predict(y_list):
            y = np.array(y_list)
            # 1. Base prediction (mean)
            base = np.mean(y)
            residuals = y - base
            
            # 2. Fit gradient trend on residuals
            x_mean = np.mean(x)
            r_mean = np.mean(residuals)
            num = np.sum((x - x_mean) * (residuals - r_mean))
            den = np.sum((x - x_mean) ** 2)
            
            m = (num / den) if den > 0 else 0.0
            c = r_mean - m * x_mean
            
            # Learning rate (shrinkage)
            lr = 0.2
            
            # Predict
            pred = base + lr * (m * (n + 1) + c)
            
            # Generate 5 forecasts
            trend = []
            for i in range(1, 6):
                trend_val = base + lr * (m * (n + i) + c)
                trend.append(max(0.0, trend_val))
                
            return pred, trend

        pred_runs, trend_runs = boost_predict(runs)
        pred_wkt, _ = boost_predict(wickets)
        pred_sr, _ = boost_predict(sr)

        return pred_runs, pred_wkt, pred_sr, trend_runs

    @staticmethod
    def _fit_lstm(x, runs, wickets, sr, n):
        # Simulates Recurrent Neural Network/LSTM: rolling sequence learning with forget gates
        # We implement this as a rolling-weighted average where weights decay exponentially
        # backwards in time, and we add a momentum factor (recent rate of change).
        
        def lstm_predict(y_list):
            # Weights decay by a factor of 0.8 as we go back in time
            weights = np.array([0.8 ** (n - i - 1) for i in range(n)])
            weights /= np.sum(weights) # Normalize weights
            
            # Long-term state (weighted average)
            lt_state = np.sum(np.array(y_list) * weights)
            
            # Short-term cell state (momentum from last 3 matches)
            if n >= 3:
                recent_slope = (y_list[-1] - y_list[-3]) / 2.0
            else:
                recent_slope = (y_list[-1] - y_list[0]) / max(1, n - 1)
                
            # Predict next match using gated combination of long-term and short-term trends
            forget_gate = 0.75
            input_gate = 0.25
            
            pred = (forget_gate * lt_state) + (input_gate * (y_list[-1] + recent_slope))
            
            # Forecast trend
            trend = []
            curr_pred = pred
            curr_slope = recent_slope
            for i in range(1, 6):
                trend.append(max(0.0, curr_pred))
                # Decay the slope (forget gate)
                curr_slope *= 0.6
                curr_pred = 0.95 * curr_pred + 0.05 * np.mean(y_list) + curr_slope

            return pred, trend

        pred_runs, trend_runs = lstm_predict(runs)
        pred_wkt, _ = lstm_predict(wickets)
        pred_sr, _ = lstm_predict(sr)

        return pred_runs, pred_wkt, pred_sr, trend_runs
