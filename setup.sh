#!/bin/bash

# Setup script for Python Meal Prep Application

echo "Setting up Python Meal Prep Application..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists, if not create a template
if [ ! -f ".env" ]; then
    echo "Creating .env file template..."
    cat > .env << EOL
MONGODB_URI=mongodb://localhost:27017/mealprep
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
EOL
    echo "Created .env file. Please update with your actual values."
fi

echo "Setup complete!"
echo ""
echo "To run the application:"
echo "  source venv/bin/activate"
echo "  python app.py"
echo ""
echo "To run the demo:"
echo "  source venv/bin/activate"
echo "  python meal_generation_demo.py"