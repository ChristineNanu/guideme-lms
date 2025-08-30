from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# --- Database setup ---
def get_db_connection():
    conn = sqlite3.connect('guideme_lms.db')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database (runs once at startup)
with get_db_connection() as conn:
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )
    ''')
    # Insert a test user if not exists
    conn.execute('''
        INSERT OR IGNORE INTO users (email, password)
        VALUES ('test@example.com', '1234')
    ''')
    conn.commit()

# --- Routes ---
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "GuideMe LMS API is running"})

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Backend is running"})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    with get_db_connection() as conn:
        user = conn.execute(
            "SELECT * FROM users WHERE email=? AND password=?",
            (email, password)
        ).fetchone()

    if user:
        return jsonify({"success": True, "message": "Login OK"})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/dashboard', methods=['GET'])
def dashboard():
    # Dummy data to simulate LMS courses
    courses = [
        {"id": 1, "name": "Introduction to Programming", "progress": "70%"},
        {"id": 2, "name": "Database Fundamentals", "progress": "50%"},
        {"id": 3, "name": "Web Development Basics", "progress": "90%"}
    ]
    return jsonify({"success": True, "courses": courses})

if __name__ == '__main__':
    app.run(debug=True)
