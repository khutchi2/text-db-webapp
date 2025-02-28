from flask import Flask, request, jsonify, g
import sqlite3
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication
DATABASE = '/app/data/database.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    os.makedirs(os.path.dirname(DATABASE), exist_ok=True)
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.route('/api/messages', methods=['GET'])
def get_messages():
    db = get_db()
    cur = db.execute('SELECT id, title, content FROM messages ORDER BY id DESC')
    messages = [dict(id=row['id'], title=row['title'], content=row['content']) for row in cur.fetchall()]
    return jsonify(messages)

@app.route('/api/messages', methods=['POST'])
def add_message():
    if not request.json or not 'title' in request.json or not 'content' in request.json:
        return jsonify({'error': 'Missing required fields'}), 400
    
    db = get_db()
    db.execute('INSERT INTO messages (title, content) VALUES (?, ?)',
              [request.json['title'], request.json['content']])
    db.commit()
    return jsonify({'status': 'success'}), 201

@app.cli.command('initdb')
def initdb_command():
    init_db()
    print('Initialized the database.')

if __name__ == '__main__':
    if not os.path.exists(DATABASE):
        init_db()
    app.run(host='0.0.0.0', port=5000)
