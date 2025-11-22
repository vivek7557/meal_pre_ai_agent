from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from functools import wraps
import os
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
import re
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Security and rate limiting
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["100 per hour"]
)

# Database connection (using MongoDB as in the original)
client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/mealprep'))
db = client.mealprep

# JWT secret
JWT_SECRET = os.getenv('JWT_SECRET', 'defaultSecret')

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-auth-token')
        
        if not token:
            return jsonify({'success': False, 'message': 'No token, authorization denied'}), 401
        
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user_id = data['user']['id']
        except jwt.ExpiredSignatureError:
            return jsonify({'success': False, 'message': 'Token is expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'success': False, 'message': 'Token is not valid'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated

# Validation functions
def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

# Helper functions for meal generation
def generate_meal_plan(dietary_preference, allergies, nutritional_goal, number_of_meals, preferred_cuisine):
    """Generate a meal plan based on user preferences"""
    meals = []
    grocery_list = {
        'produce': [],
        'grains': [],
        'proteins': [],
        'dairy': [],
        'pantry': []
    }

    # Sample meal generation based on preferences
    meal_types = ['breakfast', 'lunch', 'dinner', 'snack']
    
    for i in range(number_of_meals):
        meal_type = meal_types[i % 4]
        meal = generate_meal(meal_type, dietary_preference, preferred_cuisine, nutritional_goal)
        meals.append(meal)
        
        # Add ingredients to grocery list
        add_to_grocery_list(grocery_list, meal['ingredients'])
    
    return {
        'meals': meals,
        'grocery_list': grocery_list
    }

def generate_meal(meal_type, dietary_preference, cuisine, goal):
    """Generate a single meal based on preferences"""
    base_meals = {
        'breakfast': {
            'name': "Mediterranean Breakfast Bowl",
            'description': "Greek yogurt with honey, mixed berries, and almonds",
            'ingredients': ["Greek yogurt", "Honey", "Mixed berries", "Almonds"],
            'prep_time': "10 minutes",
            'calories': 320,
            'protein': 18,
            'carbs': 28,
            'fat': 16,
            'meal_type': 'breakfast'
        },
        'lunch': {
            'name': "Quinoa Mediterranean Salad",
            'description': "Quinoa with chickpeas, cucumber, tomatoes, olives, and feta",
            'ingredients': ["Quinoa", "Chickpeas", "Cucumber", "Tomatoes", "Olives", "Feta cheese"],
            'prep_time': "20 minutes",
            'calories': 450,
            'protein': 16,
            'carbs': 58,
            'fat': 18,
            'meal_type': 'lunch'
        },
        'dinner': {
            'name': "Herb-Crusted Salmon with Roasted Vegetables",
            'description': "Salmon with herbs and roasted Mediterranean vegetables",
            'ingredients': ["Salmon", "Herbs", "Zucchini", "Eggplant", "Bell peppers", "Olive oil"],
            'prep_time': "30 minutes",
            'calories': 520,
            'protein': 32,
            'carbs': 18,
            'fat': 32,
            'meal_type': 'dinner'
        },
        'snack': {
            'name': "Mediterranean Hummus with Veggies",
            'description': "Homemade hummus with fresh vegetables",
            'ingredients': ["Chickpeas", "Tahini", "Lemon", "Garlic", "Carrots", "Cucumber"],
            'prep_time': "15 minutes",
            'calories': 180,
            'protein': 6,
            'carbs': 20,
            'fat': 9,
            'meal_type': 'snack'
        }
    }

    return base_meals[meal_type]

def add_to_grocery_list(grocery_list, ingredients):
    """Add ingredients to the appropriate category in the grocery list"""
    for ingredient in ingredients:
        if ingredient in ['Greek yogurt', 'Feta cheese']:
            grocery_list['dairy'].append(ingredient)
        elif ingredient in ['Quinoa', 'Rice', 'Pasta']:
            grocery_list['grains'].append(ingredient)
        elif ingredient in ['Chickpeas', 'Salmon', 'Almonds']:
            grocery_list['proteins'].append(ingredient)
        elif ingredient in ['Tomatoes', 'Cucumber', 'Carrots', 'Bell peppers', 'Zucchini', 'Eggplant']:
            grocery_list['produce'].append(ingredient)
        else:
            grocery_list['pantry'].append(ingredient)

# Routes

# Auth routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    # Validation
    errors = []
    if not name or name.strip() == '':
        errors.append({'msg': 'Name is required'})
    if not email or not validate_email(email):
        errors.append({'msg': 'Please include a valid email'})
    if not password or len(password) < 6:
        errors.append({'msg': 'Password must be at least 6 characters'})
    
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    
    # Check if user already exists
    existing_user = db.users.find_one({'email': email})
    if existing_user:
        return jsonify({
            'success': False,
            'message': 'User already exists'
        }), 400
    
    # Create new user
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
    
    user_data = {
        'name': name,
        'email': email,
        'password': hashed_password,
        'dietary_preference': 'omnivore',
        'allergies': [],
        'nutritional_goal': 'maintenance',
        'preferred_cuisine': 'any',
        'date': datetime.utcnow()
    }
    
    result = db.users.insert_one(user_data)
    user_id = str(result.inserted_id)
    
    # Generate JWT token
    token = jwt.encode({
        'user': {'id': user_id},
        'exp': datetime.utcnow() + timedelta(days=7)
    }, JWT_SECRET, algorithm="HS256")
    
    # Return user info without password
    user_response = {
        'id': user_id,
        'name': name,
        'email': email
    }
    
    return jsonify({
        'success': True,
        'token': token,
        'user': user_response
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    
    # Validation
    errors = []
    if not email or not validate_email(email):
        errors.append({'msg': 'Please include a valid email'})
    if not password:
        errors.append({'msg': 'Password is required'})
    
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    
    # Check if user exists
    user = db.users.find_one({'email': email})
    if not user:
        return jsonify({
            'success': False,
            'message': 'Invalid credentials'
        }), 400
    
    # Check password
    if not check_password_hash(user['password'], password):
        return jsonify({
            'success': False,
            'message': 'Invalid credentials'
        }), 400
    
    # Generate JWT token
    token = jwt.encode({
        'user': {'id': str(user['_id'])},
        'exp': datetime.utcnow() + timedelta(days=7)
    }, JWT_SECRET, algorithm="HS256")
    
    # Return user info without password
    user_response = {
        'id': str(user['_id']),
        'name': user['name'],
        'email': user['email']
    }
    
    return jsonify({
        'success': True,
        'token': token,
        'user': user_response
    })

@app.route('/api/auth', methods=['GET'])
@token_required
def get_user(current_user_id):
    user = db.users.find_one({'_id': ObjectId(current_user_id)})
    if not user:
        return jsonify({'success': False, 'message': 'User not found'}), 404
    
    # Return user without password
    user_response = {
        'id': str(user['_id']),
        'name': user['name'],
        'email': user['email'],
        'dietary_preference': user.get('dietary_preference', 'omnivore'),
        'allergies': user.get('allergies', []),
        'nutritional_goal': user.get('nutritional_goal', 'maintenance'),
        'preferred_cuisine': user.get('preferred_cuisine', 'any'),
        'date': user.get('date')
    }
    
    return jsonify({
        'success': True,
        'user': user_response
    })

# Meal routes
@app.route('/api/meals/generate', methods=['POST'])
@token_required
def generate_meal_plan_route(current_user_id):
    data = request.get_json()
    
    dietary_preference = data.get('dietaryPreference')
    allergies = data.get('allergies', [])
    nutritional_goal = data.get('nutritionalGoal')
    number_of_meals = data.get('numberOfMeals')
    preferred_cuisine = data.get('preferredCuisine')
    
    # Validation
    if not dietary_preference or not nutritional_goal or not number_of_meals or not preferred_cuisine:
        return jsonify({
            'success': False,
            'message': 'Missing required fields'
        }), 400
    
    try:
        # Generate meal plan
        meal_plan_data = generate_meal_plan(
            dietary_preference, 
            allergies, 
            nutritional_goal, 
            number_of_meals, 
            preferred_cuisine
        )
        
        # Create meal plan document
        meal_plan_doc = {
            'user': ObjectId(current_user_id),
            'dietary_preference': dietary_preference,
            'allergies': allergies,
            'nutritional_goal': nutritional_goal,
            'number_of_meals': number_of_meals,
            'preferred_cuisine': preferred_cuisine,
            'meals': meal_plan_data['meals'],
            'grocery_list': meal_plan_data['grocery_list'],
            'date': datetime.utcnow()
        }
        
        result = db.meal_plans.insert_one(meal_plan_doc)
        saved_meal_plan = db.meal_plans.find_one({'_id': result.inserted_id})
        
        # Format response with user data
        user = db.users.find_one({'_id': ObjectId(current_user_id)}, {'password': 0})
        
        response = {
            'success': True,
            'data': {
                '_id': str(saved_meal_plan['_id']),
                'user': {
                    'id': str(user['_id']),
                    'name': user['name'],
                    'email': user['email']
                },
                'dietary_preference': saved_meal_plan['dietary_preference'],
                'allergies': saved_meal_plan['allergies'],
                'nutritional_goal': saved_meal_plan['nutritional_goal'],
                'number_of_meals': saved_meal_plan['number_of_meals'],
                'preferred_cuisine': saved_meal_plan['preferred_cuisine'],
                'meals': saved_meal_plan['meals'],
                'grocery_list': saved_meal_plan['grocery_list'],
                'date': saved_meal_plan['date']
            }
        }
        
        return jsonify(response)
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Server error'
        }), 500

@app.route('/api/meals/my-plans', methods=['GET'])
@token_required
def get_user_meal_plans(current_user_id):
    try:
        meal_plans = list(db.meal_plans.find({'user': ObjectId(current_user_id)}).sort('date', -1))
        
        # Format response
        formatted_plans = []
        for plan in meal_plans:
            user = db.users.find_one({'_id': plan['user']}, {'password': 0})
            formatted_plans.append({
                '_id': str(plan['_id']),
                'user': {
                    'id': str(user['_id']),
                    'name': user['name'],
                    'email': user['email']
                },
                'dietary_preference': plan['dietary_preference'],
                'allergies': plan['allergies'],
                'nutritional_goal': plan['nutritional_goal'],
                'number_of_meals': plan['number_of_meals'],
                'preferred_cuisine': plan['preferred_cuisine'],
                'meals': plan['meals'],
                'grocery_list': plan['grocery_list'],
                'date': plan['date']
            })
        
        return jsonify({
            'success': True,
            'data': formatted_plans
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Server error'
        }), 500

@app.route('/api/meals/<plan_id>', methods=['GET'])
@token_required
def get_specific_meal_plan(current_user_id, plan_id):
    try:
        meal_plan = db.meal_plans.find_one({'_id': ObjectId(plan_id)})
        
        if not meal_plan:
            return jsonify({
                'success': False,
                'message': 'Meal plan not found'
            }), 404
        
        # Check if user owns the meal plan
        if str(meal_plan['user']) != current_user_id:
            return jsonify({
                'success': False,
                'message': 'User not authorized'
            }), 401
        
        user = db.users.find_one({'_id': ObjectId(current_user_id)}, {'password': 0})
        
        response = {
            'success': True,
            'data': {
                '_id': str(meal_plan['_id']),
                'user': {
                    'id': str(user['_id']),
                    'name': user['name'],
                    'email': user['email']
                },
                'dietary_preference': meal_plan['dietary_preference'],
                'allergies': meal_plan['allergies'],
                'nutritional_goal': meal_plan['nutritional_goal'],
                'number_of_meals': meal_plan['number_of_meals'],
                'preferred_cuisine': meal_plan['preferred_cuisine'],
                'meals': meal_plan['meals'],
                'grocery_list': meal_plan['grocery_list'],
                'date': meal_plan['date']
            }
        }
        
        return jsonify(response)
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Server error'
        }), 500

# Error handling middleware
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': 'Route not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'message': 'Something went wrong!'
    }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))