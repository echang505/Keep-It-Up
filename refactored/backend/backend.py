from flask import Flask, request, jsonify
import os
import json
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Supabase PostgreSQL connection details
DB_HOST = os.getenv('SUPABASE_DB_HOST')
DB_PORT = os.getenv('SUPABASE_DB_PORT', '5432')
DB_NAME = os.getenv('SUPABASE_DB_NAME')
DB_USER = os.getenv('SUPABASE_DB_USER')
DB_PASSWORD = os.getenv('SUPABASE_DB_PASSWORD')

# Function to get database connection
def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

# Initialize database table if it doesn't exist
def init_db():
    conn = get_db_connection()
    if conn:
        try:
            with conn.cursor() as cur:
                # Create scores table if it doesn't exist
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS scores (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(100) NOT NULL,
                        score INTEGER NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                conn.commit()
                print("Database initialized successfully")
        except Exception as e:
            print(f"Error initializing database: {e}")
        finally:
            conn.close()

# Endpoint to get leaderboard with pagination
@app.route('/leaderboard/keepitup', methods=['GET'])
def get_leaderboard():
    try:
        # Get pagination parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        
        # Calculate offset
        offset = (page - 1) * per_page
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Get total count
                cur.execute("SELECT COUNT(*) FROM scores")
                total_scores = cur.fetchone()['count']
                
                # Get paginated scores
                cur.execute("""
                    SELECT name, score 
                    FROM scores 
                    ORDER BY score DESC 
                    LIMIT %s OFFSET %s
                """, (per_page, offset))
                
                scores = cur.fetchall()
                
                # Calculate total pages
                total_pages = (int(total_scores) + per_page - 1) // per_page
                
                return jsonify({
                    'scores': scores,
                    'total': total_scores,
                    'page': page,
                    'per_page': per_page,
                    'total_pages': total_pages
                })
        finally:
            conn.close()
            
    except Exception as e:
        print(f"Error in get_leaderboard: {e}")
        return jsonify({"error": "Failed to load leaderboard"}), 500

# Endpoint to submit a score
@app.route('/submit/keepitup', methods=['POST'])
def submit_score():
    try:
        data = request.json
        name = data.get('name')
        score = data.get('score')

        if not name or score is None:
            return jsonify({'error': 'Name and score are required.'}), 400

        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO scores (name, score) VALUES (%s, %s)",
                    (name, score)
                )
                conn.commit()
                return jsonify({'message': 'Score submitted successfully!'}), 200
        finally:
            conn.close()
            
    except Exception as e:
        print(f"Error in submit_score: {e}")
        return jsonify({"error": "Failed to submit score"}), 500

# Initialize database on startup
init_db()

# Start the Flask server
if __name__ == '__main__':
    print("Server starting with Supabase PostgreSQL connection")
    app.run(debug=True, host='0.0.0.0', port=5001)
