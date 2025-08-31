from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('guideme_lms.db')
    conn.row_factory = sqlite3.Row
    return conn

# ----------------------
# Initialize database
# ----------------------
with get_db_connection() as conn:
    # Users table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )
    ''')
    # Sample user
    conn.execute('''
        INSERT OR IGNORE INTO users (id, email, password)
        VALUES (1, 'test@example.com', '1234')
    ''')

    # Courses table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL
        )
    ''')
    # Sample courses
    conn.execute("INSERT OR IGNORE INTO courses (id, title) VALUES (1, 'Python Basics')")
    conn.execute("INSERT OR IGNORE INTO courses (id, title) VALUES (2, 'React Fundamentals')")

    # User-Course progress table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS user_courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            course_id INTEGER,
            progress INTEGER DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(course_id) REFERENCES courses(id)
        )
    ''')
    # Sample progress
    conn.execute("INSERT OR IGNORE INTO user_courses (id, user_id, course_id, progress) VALUES (1, 1, 1, 50)")
    conn.execute("INSERT OR IGNORE INTO user_courses (id, user_id, course_id, progress) VALUES (2, 1, 2, 20)")

    conn.commit()

# ----------------------
# Routes
# ----------------------

@app.route('/ping')
def ping():
    return jsonify({"message": "Backend running"})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email, password = data.get('email'), data.get('password')
    with get_db_connection() as conn:
        user = conn.execute(
            "SELECT * FROM users WHERE email=? AND password=?", 
            (email, password)
        ).fetchone()
    if user:
        return jsonify({"success": True, "message": "Login OK", "email": email})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email, password = data.get('email'), data.get('password')

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password required"}), 400

    with get_db_connection() as conn:
        try:
            conn.execute(
                "INSERT INTO users (email, password) VALUES (?, ?)", 
                (email, password)
            )
            conn.commit()
            return jsonify({
                "success": True,
                "message": "User registered and logged in successfully",
                "email": email
            })
        except sqlite3.IntegrityError:
            return jsonify({"success": False, "message": "Email already registered"}), 409


@app.route('/guide')
def guide():
    steps = [
        "Go to your LMS login page.",
        "Enter your student email.",
        "Enter your password carefully.",
        "If login fails, click 'Forgot Password'.",
        "Stay signed in to prevent auto-logout."
    ]
    return jsonify({"steps": steps})


@app.route('/user/courses')
def user_courses():
    email = request.args.get('email')
    if not email:
        return jsonify({"courses": []})

    with get_db_connection() as conn:
        user = conn.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
        if not user:
            return jsonify({"courses": []})

        user_id = user['id']
        courses = conn.execute('''
            SELECT c.title, uc.progress
            FROM courses c
            LEFT JOIN user_courses uc ON c.id = uc.course_id AND uc.user_id=?
        ''', (user_id,)).fetchall()

        course_list = [{"title": c["title"], "progress": c["progress"] or 0} for c in courses]
        return jsonify({"courses": course_list})


if __name__ == '__main__':
    app.run(debug=True)
