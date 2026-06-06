import os
from dotenv import load_dotenv

# Load env variables from .env file
load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME = os.getenv("DB_NAME", "cricket_insight_pro")
    JWT_SECRET = os.getenv("JWT_SECRET", "cricket_insight_pro_super_secret_key_12345!")
    PORT = int(os.getenv("PORT", 5000))
    HOST = os.getenv("HOST", "0.0.0.0")
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"

