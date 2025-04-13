# Keep It Up Backend

This is the backend server for the Keep It Up game, using Flask and Supabase PostgreSQL.

## Setup

### Option 1: Using the setup script (Recommended)

1. Run the setup script:
   ```
   ./setup.sh
   ```
   This will:
   - Create a virtual environment if it doesn't exist
   - Activate the virtual environment
   - Install all required dependencies

### Option 2: Manual setup

1. Create and activate a virtual environment:
   ```
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Set up Supabase:
   - Create a Supabase account at [https://supabase.com](https://supabase.com)
   - Create a new project
   - Go to Project Settings > Database to find your connection details
   - Update the `.env` file with your Supabase connection details:
     ```
     SUPABASE_DB_HOST=db.your-project-id.supabase.co
     SUPABASE_DB_PORT=5432
     SUPABASE_DB_NAME=postgres
     SUPABASE_DB_USER=postgres
     SUPABASE_DB_PASSWORD=your-supabase-db-password
     ```

4. Run the server:
   ```
   python backend.py
   ```

## Running the Server

After setup, to run the server:

1. Activate the virtual environment:
   ```
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Start the server:
   ```
   python backend.py
   ```

## API Endpoints

### Get Leaderboard
- **URL**: `/leaderboard/keepitup`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `per_page`: Number of scores per page (default: 10)
- **Response**: JSON with scores, pagination info

### Submit Score
- **URL**: `/submit/keepitup`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "Player Name",
    "score": 100
  }
  ```
- **Response**: Success message or error

## Database Schema

The backend uses a PostgreSQL database with the following schema:

```sql
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
``` 