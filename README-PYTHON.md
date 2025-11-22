# Meal Prep Application - Python Version

This is the Python conversion of the original Node.js/Express meal prep application. It provides the same functionality using Flask and MongoDB.

## Features

- User registration and authentication with JWT tokens
- Meal plan generation based on dietary preferences
- Grocery list creation
- User profile management
- Secure API endpoints

## Requirements

- Python 3.8+
- MongoDB (local or cloud instance)

## Installation

1. Clone the repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   ```bash
   cp .env.example .env  # if available, or create your own .env file
   ```
5. Make sure MongoDB is running

## Environment Variables

Create a `.env` file with the following variables:

```
MONGODB_URI=mongodb://localhost:27017/mealprep
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

## Running the Application

```bash
python app.py
```

Or using Flask's built-in server:

```bash
export FLASK_APP=app.py
flask run
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth` - Get authenticated user info

### Meal Plans

- `POST /api/meals/generate` - Generate a new meal plan
- `GET /api/meals/my-plans` - Get all user's meal plans
- `GET /api/meals/:id` - Get a specific meal plan

## Database Schema

The application uses MongoDB with the following collections:

- `users`: Stores user information (name, email, password hash, preferences)
- `meal_plans`: Stores generated meal plans with meals and grocery lists

## Conversion Notes

This Python version maintains the same functionality as the original Node.js application:

- Authentication middleware converted to a Python decorator
- Mongoose schemas replaced with direct MongoDB operations
- Express routes converted to Flask routes
- Same meal generation algorithms
- Same data validation and error handling patterns