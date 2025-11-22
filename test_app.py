"""
Test script for the Python Meal Prep Application
This script demonstrates the functionality of the converted Python app
"""

import requests
import json
from datetime import datetime

# Base URL for the application (adjust if running on different port)
BASE_URL = "http://localhost:5000"

def test_api_endpoints():
    print("Testing Python Meal Prep Application...")
    print("=" * 50)
    
    # Test 1: Register a new user
    print("\n1. Testing User Registration:")
    register_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/register", json=register_data)
        print(f"Registration Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            token = response.json()['token']
            user_id = response.json()['user']['id']
            print(f"Token received: {token[:20]}...")
        else:
            print("Registration failed!")
            return
    except requests.exceptions.ConnectionError:
        print("Cannot connect to the server. Make sure the Flask app is running.")
        return
    
    # Test 2: Login
    print("\n2. Testing User Login:")
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Login Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            token = response.json()['token']
            print(f"Login token: {token[:20]}...")
        else:
            print("Login failed!")
            return
    except requests.exceptions.RequestException as e:
        print(f"Error during login: {e}")
    
    # Test 3: Get user info with authentication
    print("\n3. Testing Get User Info:")
    headers = {"x-auth-token": token}
    
    try:
        response = requests.get(f"{BASE_URL}/api/auth", headers=headers)
        print(f"Get User Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"Error getting user info: {e}")
    
    # Test 4: Generate meal plan
    print("\n4. Testing Meal Plan Generation:")
    meal_plan_data = {
        "dietaryPreference": "vegetarian",
        "allergies": ["nuts"],
        "nutritionalGoal": "weight-loss",
        "numberOfMeals": 4,
        "preferredCuisine": "mediterranean"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/meals/generate", 
                                json=meal_plan_data, headers=headers)
        print(f"Generate Meal Plan Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            plan_id = response.json()['data']['_id']
            print(f"Meal plan created with ID: {plan_id}")
    except requests.exceptions.RequestException as e:
        print(f"Error generating meal plan: {e}")
    
    # Test 5: Get user's meal plans
    print("\n5. Testing Get User's Meal Plans:")
    try:
        response = requests.get(f"{BASE_URL}/api/meals/my-plans", headers=headers)
        print(f"Get Meal Plans Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"Error getting meal plans: {e}")
    
    # Test 6: Get specific meal plan
    if 'plan_id' in locals():
        print(f"\n6. Testing Get Specific Meal Plan ({plan_id}):")
        try:
            response = requests.get(f"{BASE_URL}/api/meals/{plan_id}", headers=headers)
            print(f"Get Specific Plan Status: {response.status_code}")
            print(f"Response: {response.json()}")
        except requests.exceptions.RequestException as e:
            print(f"Error getting specific meal plan: {e}")
    
    print("\n" + "=" * 50)
    print("Test completed!")

if __name__ == "__main__":
    test_api_endpoints()