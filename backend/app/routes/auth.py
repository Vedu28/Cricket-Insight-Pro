import datetime
import jwt
import bcrypt
from flask import Blueprint, request, jsonify, g
from functools import wraps
from app.config import Config
from app.database import get_db

auth_bp = Blueprint('auth', __name__)

def generate_token(user_id, role):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id,
        'role': role
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Authorization token is missing!'}), 401
        
        try:
            data = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
            db = get_db()
            user = db["users"].find_one({"_id": data['sub']})
            if not user:
                return jsonify({'message': 'User not found!'}), 401
            g.current_user = user
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Signature expired. Please log in again.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token. Please log in again.'}), 401
            
        return f(*args, **kwargs)
    return decorated

def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(g, 'current_user') or not g.current_user:
                return jsonify({'message': 'Access denied: User not authenticated!'}), 401
            user_role = g.current_user.get('role', 'USER')
            if user_role not in allowed_roles:
                return jsonify({'message': f'Access denied: Requires role in {allowed_roles}'}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'USER') # ANALYST or USER only
    
    if not name or not email or not password:
        return jsonify({'message': 'Name, email, and password are required!'}), 400
    
    # Only allow USER or ANALYST role for new registrations
    if role not in ['USER', 'ANALYST']:
        return jsonify({'message': 'Invalid role. Only USER or ANALYST roles are allowed for new registrations.'}), 400
        
    db = get_db()
    
    # Check if user exists
    existing_user = db["users"].find_one({"email": email})
    if existing_user:
        return jsonify({'message': 'User with this email already exists!'}), 409
        
    # Hash password
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    user_doc = {
        "name": name,
        "email": email,
        "password_hash": password_hash,
        "role": role,
        "is_verified": False,
        "created_at": datetime.datetime.now()
    }
    
    res = db["users"].insert_one(user_doc)
    user_id = str(res.inserted_id)
    
    # Generate token
    token = generate_token(user_id, role)
    
    return jsonify({
        'message': 'Registration successful!',
        'token': token,
        'user': {
            'id': user_id,
            'name': name,
            'email': email,
            'role': role
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required!'}), 400
        
    db = get_db()
    user = db["users"].find_one({"email": email})
    
    if not user:
        return jsonify({'message': 'Invalid email or password!'}), 401
        
    pw_hash = user.get('password_hash')
    if not bcrypt.checkpw(password.encode('utf-8'), pw_hash.encode('utf-8')):
        return jsonify({'message': 'Invalid email or password!'}), 401
        
    user_id = str(user['_id'])
    role = user.get('role', 'USER')
    token = generate_token(user_id, role)
    
    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': {
            'id': user_id,
            'name': user.get('name'),
            'email': user.get('email'),
            'role': role
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_me():
    user = g.current_user
    return jsonify({
        'user': {
            'id': str(user['_id']),
            'name': user.get('name'),
            'email': user.get('email'),
            'role': user.get('role'),
            'is_verified': user.get('is_verified', False)
        }
    }), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json() or {}
    email = data.get('email')
    new_password = data.get('new_password')
    
    if not email or not new_password:
        return jsonify({'message': 'Email and new password are required!'}), 400
        
    db = get_db()
    user = db["users"].find_one({"email": email})
    if not user:
        return jsonify({'message': 'User with this email not found!'}), 404
        
    salt = bcrypt.gensalt()
    new_hash = bcrypt.hashpw(new_password.encode('utf-8'), salt).decode('utf-8')
    
    db["users"].update_one({"email": email}, {"$set": {"password_hash": new_hash}})
    
    return jsonify({'message': 'Password has been reset successfully!'}), 200

@auth_bp.route('/verify-email', methods=['POST'])
@token_required
def verify_email():
    user = g.current_user
    db = get_db()
    db["users"].update_one({"_id": user["_id"]}, {"$set": {"is_verified": True}})
    return jsonify({'message': 'Email successfully verified!'}), 200
