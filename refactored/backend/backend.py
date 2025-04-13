import os
from flask import Flask, request, jsonify, make_response
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  


# # Load environment variables from .env file
load_dotenv()

db = SQLAlchemy()

app = Flask(__name__)
CORS(app)  
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI']  = os.getenv('DATABASE_URL')
db.init_app(app)

class Score(db.Model):
    __tablename__ = 'scores'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())

# Initialize database table if it doesn't exist
def init_db():
    with app.app_context():
        db.create_all()
        print("Database initialized using SQLAlchemy.")

init_db()

# Endpoint to get leaderboard with pagination
@app.route('/get/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        # Query all scores ordered by descending score
        scores_query = Score.query.order_by(Score.score.desc()).all()
        scores = [{"name": s.name, "score": s.score} for s in scores_query]

        return jsonify({
            'scores': scores,
            'total': len(scores)
        })

    except Exception as e:
        print(f"Error in get_leaderboard: {e}")
        return jsonify({"error": "Failed to load leaderboard"}), 500

# Endpoint to submit a score
@app.route('/post/score', methods=['POST'])
def submit_score():
    try:
        data = request.json
        name = data.get('name')
        score = data.get('score')

        if not name or score is None:
            return jsonify({'error': 'Name and score are required.'}), 400

        print(f"Received score submission: Name={name}, Score={score}")
        new_score = Score(name=name, score=score)
        db.session.add(new_score)
        db.session.commit()

        return jsonify({'message': 'Score submitted successfully!'}), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error in submit_score: {e}")
        return jsonify({"error": "Failed to submit score"}), 500


# Test route to check server status
@app.route('/test', methods=['GET'])
def test_route():
    return jsonify({"message": "Server is running!"}), 200

# Start the Flask server
if __name__ == '__main__':
    print("Server starting with Supabase PostgreSQL connection")
    app.run(debug=True, host='0.0.0.0', port=5001)
