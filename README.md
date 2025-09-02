# GuideMe LMS

GuideMe LMS is a fast, lightweight, and affordable Learning Management System (LMS) built for tutors, schools, and training centers. It allows educators to easily create, manage, and deliver engaging courses while providing students with a smooth, intuitive learning experience.

# Features
Course Management – Create, edit, and organize courses with lessons, descriptions, content, duration, and pricing.

Student Enrollment & Progress Tracking – Register students, monitor progress, and view performance.

Integrated Payments – Support for M-Pesa (and easily configurable for other gateways).

Notifications – Keep students updated about course progress, payments, and reminders.

Responsive Design – Works seamlessly across desktops, tablets, and mobile devices.

Modern Stack – Combines React frontend with Flask backend for a fast, scalable solution.

# Tech Stack

Frontend: React, Vite, Chakra UI, TailwindCSS

Backend: Flask (Python), SQLite (or other SQL databases)

Payments: M-Pesa API

Deployment: Compatible with Vercel (frontend), Render, Railway, or any cloud service

# Getting Started

Follow these steps to run GuideMe LMS locally.

# Prerequisites

Node.js v18+ and npm

Python 3.10+ and pip

Git

1. Clone the Repository
git clone https://github.com/ChristineNanu/guideme-lms.git
cd guideme-lms

2. Set Up the Frontend
cd guideme-frontend
npm install
npm run dev

The frontend will run at http://localhost:5173 by default.

3. Set Up the Backend
cd ../guideme-backend
python3 -m venv venv          # Create a virtual environment
source venv/bin/activate      # Activate the environment (Linux/Mac)
# For Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py                 # Start the Flask backend


The backend will run at http://localhost:5000 by default.

Ensure the frontend calls this backend URL for API requests.

4. Environment Variables

Configure M-Pesa API keys and other sensitive data in a .env file for security.

Example:

-CONSUMER_KEY=your_consumer_key
-CONSUMER_SECRET=your_consumer_secret
-BUSINESS_SHORT_CODE=your_shortcode
-PASSKEY=your_passkey
-CALLBACK_URL=https://yourdomain.com/mpesa/callback

5. Deployment Tips

Frontend: Deploy on Vercel or Netlify.

Backend: Deploy on Render, Railway, or Heroku.

Make sure the frontend API URLs point to the live backend.

Enable CORS in the backend to allow cross-origin requests.

# Database

Default backend uses SQLite (guideme_lms.db) for simplicity.

Tables:

users – store user accounts

courses – store course info

lessons – store lessons per course

user_courses – track student progress

notifications – system alerts and reminders

payments – store payment transactions

# Contributing

Fork the repo

Create a feature branch (git checkout -b feature-name)

Commit your changes (git commit -m "Description")

Push to your branch (git push origin feature-name)

Open a pull request

# License

MIT License – free to use, modify, and distribute.
