from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime
import requests
import base64

app = Flask(__name__)
# Enable CORS globally for development (React at localhost:5173)
#CORS(app, origins=["https://guideme-lms-rlba-j98ag1z0c-christinenanus-projects.vercel.app"])
CORS(app, origins=["http://localhost:5173", "https://guideme-lms-rlba-j98ag1z0c-christinenanus-projects.vercel.app"])

app.config['CORS_HEADERS'] = 'Content-Type'

def get_db_connection():
    conn = sqlite3.connect('guideme_lms.db')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database
with get_db_connection() as conn:
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        )
    ''')
    conn.execute("INSERT OR IGNORE INTO users (id, email, password) VALUES (1, 'test@example.com', '1234')")

    conn.execute('''
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            content TEXT,
            duration TEXT,
            price REAL
        )
    ''')
    conn.execute("INSERT OR IGNORE INTO courses (id, title, description, content, duration, price) VALUES (1, 'Python Basics', 'Learn Python fundamentals', 'Variables, loops, functions', '4 weeks', 50)")
    conn.execute("INSERT OR IGNORE INTO courses (id, title, description, content, duration, price) VALUES (2, 'React Fundamentals', 'Master React basics', 'Components, hooks, state', '6 weeks', 75)")

    conn.execute('''
        CREATE TABLE IF NOT EXISTS lessons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_id INTEGER,
            title TEXT NOT NULL,
            content TEXT,
            FOREIGN KEY(course_id) REFERENCES courses(id)
        )
    ''')
    conn.execute("INSERT OR IGNORE INTO lessons (id, course_id, title, content) VALUES (1, 1, 'Variables & Data Types', 'Content for Variables & Data Types')")
    conn.execute("INSERT OR IGNORE INTO lessons (id, course_id, title, content) VALUES (2, 1, 'Loops', 'Content for Loops')")
    conn.execute("INSERT OR IGNORE INTO lessons (id, course_id, title, content) VALUES (3, 2, 'JSX & Components', 'Content for JSX & Components')")

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
    conn.execute("INSERT OR IGNORE INTO user_courses (id, user_id, course_id, progress) VALUES (1, 1, 1, 50)")
    conn.execute("INSERT OR IGNORE INTO user_courses (id, user_id, course_id, progress) VALUES (2, 1, 2, 20)")

    conn.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            text TEXT,
            read INTEGER DEFAULT 0,
            created_at TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    conn.execute('''
        INSERT OR IGNORE INTO notifications (id, user_id, text, read, created_at)
        VALUES (1, 1, 'Your React Fundamentals course is 40% complete.', 0, ?)
    ''', (datetime.now(),))

    conn.execute('''
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER REFERENCES users(id),
            course_id INTEGER REFERENCES courses(id),
            phone_number TEXT,
            amount REAL,
            status TEXT DEFAULT 'pending',
            mpesa_receipt TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()

# ----------------------
# M-Pesa Config
# ----------------------
CONSUMER_KEY = "GdiM8NxGSjVRkicRN0v0NY8GtpXeyMt8oGTfX1M38VDKHV9W"
CONSUMER_SECRET = "Z1kVxmuACObV4hFFDOJOmz1fMU31aaA5VUFTyh0S3BzLOvTF4C5fPNHDHLXBmNGY"
BUSINESS_SHORT_CODE = "174379"
PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
CALLBACK_URL = "https://example.com/mpesa/callback"

def get_access_token():
    auth = requests.auth.HTTPBasicAuth(CONSUMER_KEY, CONSUMER_SECRET)
    r = requests.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        auth=auth
    )
    return r.json().get("access_token")

# Routes
@app.route('/')
def home():
    return "Welcome to GuideMe LMS Backend!"

@app.route('/ping')
def ping():
    return jsonify({"message": "Guideme backend running"})

@app.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return jsonify({"message": "ok"}), 200
    data = request.get_json()
    email, password = data.get('email'), data.get('password')
    with get_db_connection() as conn:
        user = conn.execute("SELECT * FROM users WHERE email=? AND password=?", (email, password)).fetchone()
    if user:
        return jsonify({"success": True, "message": "Login OK", "email": email})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return jsonify({"message": "ok"}), 200
    data = request.get_json()
    email, password = data.get('email'), data.get('password')
    if not email or not password:
        return jsonify({"success": False, "message": "Email and password required"}), 400
    with get_db_connection() as conn:
        try:
            conn.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
            conn.commit()
            return jsonify({"success": True, "message": "User registered", "email": email})
        except sqlite3.IntegrityError:
            return jsonify({"success": False, "message": "Email already registered"}), 409

@app.route('/courses', methods=['GET', 'OPTIONS'])
def get_all_courses():
    if request.method == 'OPTIONS':
        return jsonify({"message": "ok"}), 200
    with get_db_connection() as conn:
        courses = conn.execute('SELECT id, title FROM courses').fetchall()
    course_list = [{"id": c["id"], "title": c["title"]} for c in courses]
    return jsonify({"courses": course_list})

@app.route('/courses/<int:id>', methods=['GET', 'OPTIONS'])
def get_course(id):
    if request.method == 'OPTIONS':
        return jsonify({"message": "ok"}), 200
    with get_db_connection() as conn:
        course = conn.execute('SELECT id, title, description, content, duration, price FROM courses WHERE id = ?', (id,)).fetchone()
    if course:
        return jsonify({"course": dict(course)})
    else:
        return jsonify({"error": "Course not found"}), 404

@app.route('/mpesa/stkpush', methods=['POST', 'OPTIONS'])
def stk_push():
    if request.method == 'OPTIONS':
        return jsonify({"message": "ok"}), 200
    data = request.json
    user_id = data.get("user_id")
    course_id = data.get("course_id")
    phone_number = data.get("phoneNumber")
    amount = data.get("amount", 10)

    with get_db_connection() as conn:
        cur = conn.cursor()
        cur.execute("INSERT INTO payments (user_id, course_id, phone_number, amount) VALUES (?, ?, ?, ?)",
                    (user_id, course_id, phone_number, amount))
        payment_id = cur.lastrowid
        conn.commit()

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    password = base64.b64encode(f"{BUSINESS_SHORT_CODE}{PASSKEY}{timestamp}".encode()).decode()
    payload = {
        "BusinessShortCode": BUSINESS_SHORT_CODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": BUSINESS_SHORT_CODE,
        "PhoneNumber": phone_number,
        "CallBackURL": CALLBACK_URL,
        "AccountReference": f"Course{course_id}",
        "TransactionDesc": f"Payment for course {course_id}"
    }
    token = get_access_token()
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", json=payload, headers=headers)
    return jsonify(res.json())

@app.route("/mpesa/callback", methods=["POST", "OPTIONS"])
def mpesa_callback():
    if request.method == 'OPTIONS':
        return jsonify({"message": "ok"}), 200
    data = request.json
    body = data.get('Body', {}).get('stkCallback', {})
    result_code = body.get('ResultCode')
    checkout_request_id = body.get('CheckoutRequestID')

    with get_db_connection() as conn:
        cur = conn.cursor()
        if result_code == 0:
            items = body.get('CallbackMetadata', {}).get('Item', [])
            mpesa_receipt = next((i['Value'] for i in items if i['Name'] == 'MpesaReceiptNumber'), None)
            cur.execute("UPDATE payments SET status='completed', mpesa_receipt=? WHERE id=?", (mpesa_receipt, checkout_request_id))
        else:
            cur.execute("UPDATE payments SET status='failed' WHERE id=?", (checkout_request_id,))
        conn.commit()
    return jsonify({"ResultCode": 0, "ResultDesc": "Accepted"})

if __name__ == '__main__':
    app.run(debug=True)
