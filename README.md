# Cricket-Insight-Pro

A comprehensive sports analytics platform designed for cricket professionals, analysts, and enthusiasts. Cricket-Insight-Pro provides real-time performance metrics, machine learning predictions, player scouting tools, and advanced fantasy analytics.

## 🏆 Features

### Dashboard & Analytics
- **Sports Analytics Hub**: Real-time performance metrics and team dashboards
- **Player Rankings**: Batting and bowling leaderboards with live rankings
- **Performance Distribution**: Runs, wickets, and consistency scoring
- **Form Tracking**: Historical form trends and performance analysis

### Player Management
- **Player Profiles**: Detailed player statistics and biographical data
- **Player Comparison**: Side-by-side analysis of multiple players
- **Scout Stats**: Consistency score, pressure index, chase score, and market valuation
- **Injury Tracking**: Real-time injury status and recovery timeline

### Advanced Features
- **ML Predictions**: Machine learning-based match outcome and performance predictions
- **AI Chat Assistant**: Intelligent chatbot for player and match insights
- **Fantasy Optimizer**: Fantasy cricket recommendations and optimization
- **Match Center**: Live match data and historical match information
- **Scouting & Auction**: Talent scouting and auction management system

### Admin Portal
- **User Management**: Admin-only access to manage users and roles
- **System Configuration**: Platform settings and data management

## 🏗️ Project Structure

```
Cricket-Insight-Pro/
├── backend/              # Python Flask API
│   ├── app/
│   │   ├── config.py     # Configuration settings
│   │   ├── database.py   # Database connection
│   │   ├── routes/       # API endpoints
│   │   │   ├── auth.py   # Authentication
│   │   │   ├── players.py
│   │   │   ├── matches.py
│   │   │   ├── predictions.py
│   │   │   ├── insights.py
│   │   │   └── scouting.py
│   │   ├── ml/           # Machine Learning engine
│   │   └── data/         # Data seeding
│   ├── requirements.txt
│   └── run.py
│
├── frontend/             # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── utils/        # Helper utilities
│   │   ├── App.tsx       # Main app
│   │   └── index.css     # Styling
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Python 3.10+**
- **Flask** - Web framework
- **MongoDB** - NoSQL database (mock via JSON)
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **scikit-learn** - Machine learning

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Frontend)
- Python 3.10+ (Backend)
- npm or yarn (Package management)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/Scripts/activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the Flask server:
```bash
python run.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔐 Authentication

### User Roles

- **ADMIN**: Full system access and user management
- **ANALYST**: Advanced analytics, predictions, and scouting
- **USER**: Basic dashboard and player information access

### Seeded Admin Account

Only one admin account is seeded into the database:
```
Email: admin@cricketinsight.com
Password: password123
```

### Registration

New users can register as **USER** or **ANALYST** roles only. Admin roles can only be created by database seeding.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (USER/ANALYST only)
- `POST /api/auth/login` - Login user
- `POST /api/auth/me` - Get current user info
- `POST /api/auth/reset-password` - Reset password

### Players
- `GET /api/players` - Get all players
- `GET /api/players/<id>` - Get player details
- `POST /api/players` - Create player (Admin)
- `PUT /api/players/<id>` - Update player (Admin)

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/<id>` - Get match details
- `POST /api/matches` - Create match (Admin)

### Predictions
- `GET /api/predictions` - Get ML predictions
- `POST /api/predictions/generate` - Generate new predictions (Analyst/Admin)

### Insights
- `GET /api/insights` - Get player insights
- `GET /api/scouting/rankings` - Get player rankings

## 🎯 Features by Role

### USER (Fan/User)
- View player profiles
- Access dashboard and analytics
- Compare players
- Chat with AI assistant
- View fantasy recommendations

### ANALYST
- All USER features
- ML predictions access
- Fantasy optimizer
- Scouting & auction tools
- Advanced performance metrics

### ADMIN
- All ANALYST features
- Admin portal access
- User management
- System configuration
- Data management

## 📝 Database Schema

### Users Collection
```
{
  _id: ObjectId,
  name: string,
  email: string (unique),
  password_hash: string,
  role: "USER" | "ANALYST" | "ADMIN",
  is_verified: boolean,
  created_at: datetime
}
```

### Players Collection
```
{
  _id: ObjectId,
  name: string,
  age: number,
  country: string,
  team: string,
  role: string,
  batting_style: string,
  bowling_style: string,
  scout_stats: {
    consistency_score: number,
    pressure_index: number,
    chase_score: number,
    powerplay_eff: number,
    death_overs_eff: number,
    injury_status: string,
    injury_recovery_time: number,
    market_value: number
  }
}
```

## 🔄 Fallback to Mock API

If the backend server is offline, the frontend automatically falls back to the mock API using data from `backend/data/mock_db.json`. This allows for continued development and testing without a running backend.

## 📦 Dependencies

### Backend
```
flask==2.3.0
flask-cors==4.0.0
pymongo==4.3.0
pyjwt==2.8.0
bcrypt==4.0.0
scikit-learn==1.2.0
```

### Frontend
```
react@18
react-dom@18
typescript@5
vite@4
tailwindcss@3
recharts@2
lucide-react@latest
```

## 🐛 Troubleshooting

### Backend won't start
- Ensure Python 3.10+ is installed
- Check virtual environment is activated
- Verify all dependencies are installed: `pip install -r requirements.txt`

### Frontend won't run
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Clear Vite cache: `rm -rf .vite`

### API Connection Issues
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Frontend will auto-fallback to mock API if backend is unavailable

## 📄 License

This project is proprietary and confidential.

## 👥 Contributing

For internal development only. Follow the project standards and conventions when contributing.

---

**Built with ❤️ for Cricket Analytics Excellence**