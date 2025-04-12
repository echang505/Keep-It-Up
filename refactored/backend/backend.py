from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

# Directory to store all leaderboard JSON files
LEADERBOARD_DIR = 'leaderboards'

# Step 1: Create the directory if it doesn't exist
if not os.path.exists(LEADERBOARD_DIR):
    os.makedirs(LEADERBOARD_DIR)

# Step 2: Helper to get the correct leaderboard file path based on the board name
def get_leaderboard_file(board_name):
    # Sanitize board_name to avoid directory traversal attacks
    safe_board_name = "".join(c for c in board_name if c.isalnum() or c in ('_', '-'))
    return os.path.join(LEADERBOARD_DIR, f"{safe_board_name}.json")

# Step 3: Helper to load leaderboard data from a specific file
def load_leaderboard(board_name):
    file_path = get_leaderboard_file(board_name)

    # If file does not exist, initialize it
    if not os.path.exists(file_path):
        with open(file_path, 'w') as f:
            json.dump([], f)

    with open(file_path, 'r') as f:
        return json.load(f)

# Step 4: Helper to save leaderboard data to a specific file
def save_leaderboard(board_name, data):
    file_path = get_leaderboard_file(board_name)
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)

# Step 5: Endpoint to get leaderboard for a given board
@app.route('/leaderboard/<board_name>', methods=['GET'])
def get_leaderboard(board_name):
    leaderboard = load_leaderboard(board_name)

    # Optional: Sort leaderboard by score descending
    leaderboard.sort(key=lambda x: x['score'], reverse=True)

    return jsonify(leaderboard)

# Step 6: Endpoint to submit a score to a specific leaderboard
@app.route('/submit/<board_name>', methods=['POST'])
def submit_score(board_name):
    data = request.json
    name = data.get('name')
    score = data.get('score')

    if not name or score is None:
        return jsonify({'error': 'Name and score are required.'}), 400

    leaderboard = load_leaderboard(board_name)
    leaderboard.append({'name': name, 'score': score})

    save_leaderboard(board_name, leaderboard)

    return jsonify({'message': f'Score submitted successfully to {board_name} leaderboard!'}), 200

# Step 7: Start the Flask server
if __name__ == '__main__':
    app.run(debug=True)
