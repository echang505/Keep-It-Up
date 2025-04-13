#!/bin/bash

# Exit on error
set -e

echo "Setting up virtual environment for Keep It Up backend..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Remove existing venv if it exists
if [ -d "venv" ]; then
    echo "Removing existing virtual environment..."
    rm -rf venv
fi

# Create a new virtual environment
echo "Creating new virtual environment..."
python3 -m venv venv

# Activate the virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Verify we're using the correct Python interpreter
PYTHON_PATH=$(which python)
echo "Using Python interpreter: $PYTHON_PATH"

# Upgrade pip
echo "Upgrading pip..."
python -m pip install --upgrade pip

# Install requirements
echo "Installing requirements..."
python -m pip install -r requirements.txt

echo "Setup complete! You can now run the backend with:"
echo "source venv/bin/activate"
echo "python backend.py" 