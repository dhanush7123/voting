from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash, get_flashed_messages
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os

app = Flask(__name__)
app.secret_key = 'your_super_secret_key'  # Make sure this is set
DATABASE = 'db/voting.db'

# Ensure db directory exists
os.makedirs('db', exist_ok=True)

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as db:
        db.executescript('''
        DROP TABLE IF EXISTS users;
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE,
            full_name TEXT,
            password TEXT NOT NULL
        );
        DROP TABLE IF EXISTS candidates;
        CREATE TABLE candidates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            position TEXT NOT NULL
        );
        DROP TABLE IF EXISTS votes;
        CREATE TABLE votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            candidate_id INTEGER NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(candidate_id) REFERENCES candidates(id)
        );
        ''')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        username = request.form['username']
        password = request.form['password']
        hashed = generate_password_hash(password)
        try:
            with get_db() as db:
                db.execute('INSERT INTO users (email, username, password) VALUES (?, ?, ?)', (email, username, hashed))
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            return 'Email or username already registered.'
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        identifier = request.form['identifier']
        password = request.form['password']
        print(f"Login attempt: {identifier}")
        with get_db() as db:
            user = db.execute('SELECT * FROM users WHERE email = ? OR username = ?', (identifier, identifier)).fetchone()
            print(f"User found: {user}")
            if user and check_password_hash(user['password'], password):
                session['user_id'] = user['id']
                print(f"Session set for user_id: {user['id']}")
                flash('Login successful!')
                return redirect(url_for('home'))
        error = 'Invalid credentials. Please try again.'
        print("Login failed.")
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/vote', methods=['GET', 'POST'])
def vote():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    with get_db() as db:
        user_id = session['user_id']
        already_voted = db.execute('SELECT * FROM votes WHERE user_id = ?', (user_id,)).fetchone()
        candidates = db.execute('SELECT * FROM candidates').fetchall()
        if request.method == 'POST':
            candidate_id = request.form['candidate_id']
            if already_voted:
                return 'You have already voted.'
            db.execute('INSERT INTO votes (user_id, candidate_id) VALUES (?, ?)', (user_id, candidate_id))
            return 'Vote cast successfully!'
        return render_template('voting.html', candidates=candidates, already_voted=already_voted)

@app.route('/results')
def results():
    with get_db() as db:
        results = db.execute('''
            SELECT candidates.position, candidates.name, COUNT(votes.id) as vote_count
            FROM candidates
            LEFT JOIN votes ON candidates.id = votes.candidate_id
            GROUP BY candidates.id
        ''').fetchall()
    return render_template('results.html', results=results)

@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        # Here you would handle password reset logic (send email, etc.)
        return 'Password reset instructions sent (not implemented).'
    return render_template('forgot-password.html')

@app.route('/debug/users')
def debug_users():
    with get_db() as db:
        users = db.execute('SELECT id, email, username FROM users').fetchall()
        return '<br>'.join([f"ID: {u['id']}, Email: {u['email']}, Username: {u['username']}" for u in users])

@app.route('/home')
def home():
    messages = get_flashed_messages()
    username = None
    full_name = None
    if 'user_id' in session:
        with get_db() as db:
            user = db.execute('SELECT username, full_name FROM users WHERE id = ?', (session['user_id'],)).fetchone()
            if user:
                username = user['username']
                full_name = user['full_name'] if 'full_name' in user.keys() else None
    return render_template('home.html', messages=messages, username=username, full_name=full_name)

@app.route('/candidate')
def candidate():
    category = request.args.get('category')
    with get_db() as db:
        candidates = db.execute('SELECT * FROM candidates WHERE position = ?', (category,)).fetchall()
    return render_template('candidate.html', category=category, candidates=candidates)

@app.route('/update_profile', methods=['POST'])
def update_profile():
    print('DEBUG: /update_profile called')
    if 'user_id' not in session:
        return redirect(url_for('login'))
    new_username = request.form.get('profileUsername')
    if new_username:
        try:
            with get_db() as db:
                # Check for duplicate username
                existing = db.execute('SELECT id FROM users WHERE username = ? AND id != ?', (new_username, session['user_id'])).fetchone()
                if existing:
                    flash('Username already taken. Please choose another.', 'error')
                else:
                    db.execute('UPDATE users SET username = ? WHERE id = ?', (new_username, session['user_id']))
                    flash('Profile updated successfully!', 'success')
        except Exception as e:
            flash('An error occurred while updating your profile.', 'error')
    else:
        flash('Username cannot be empty.', 'error')
    return redirect(url_for('home'))

@app.route('/initdb')
def initdb():
    init_db()
    return "Database initialized!"

if __name__ == '__main__':
    init_db()
    app.run(debug=True) 
