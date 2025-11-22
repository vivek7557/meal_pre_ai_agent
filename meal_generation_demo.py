"""
Meal Generation Demo for Python Meal Prep Application
This script demonstrates the meal generation functionality independently
"""

from datetime import datetime
import re
from werkzeug.security import generate_password_hash, check_password_hash

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

def demo_meal_generation():
    print("Python Meal Prep Application - Meal Generation Demo")
    print("=" * 60)
    
    # Example 1: Vegetarian weight-loss plan
    print("\nExample 1: Vegetarian weight-loss meal plan (4 meals)")
    meal_plan = generate_meal_plan(
        dietary_preference="vegetarian",
        allergies=["nuts"],
        nutritional_goal="weight-loss",
        number_of_meals=4,
        preferred_cuisine="mediterranean"
    )
    
    print(f"\nGenerated {len(meal_plan['meals'])} meals:")
    for i, meal in enumerate(meal_plan['meals']):
        print(f"\nMeal {i+1}: {meal['name']}")
        print(f"  Type: {meal['meal_type']}")
        print(f"  Description: {meal['description']}")
        print(f"  Ingredients: {', '.join(meal['ingredients'])}")
        print(f"  Prep Time: {meal['prep_time']}")
        print(f"  Calories: {meal['calories']}, Protein: {meal['protein']}g, Carbs: {meal['carbs']}g, Fat: {meal['fat']}g")
    
    print(f"\nGrocery List:")
    for category, items in meal_plan['grocery_list'].items():
        if items:
            print(f"  {category.title()}: {', '.join(items)}")
    
    # Example 2: Different preferences
    print("\n" + "=" * 60)
    print("\nExample 2: Keto muscle-gain plan (2 meals)")
    meal_plan2 = generate_meal_plan(
        dietary_preference="keto",
        allergies=[],
        nutritional_goal="muscle-gain",
        number_of_meals=2,
        preferred_cuisine="american"
    )
    
    print(f"\nGenerated {len(meal_plan2['meals'])} meals:")
    for i, meal in enumerate(meal_plan2['meals']):
        print(f"\nMeal {i+1}: {meal['name']}")
        print(f"  Type: {meal['meal_type']}")
        print(f"  Description: {meal['description']}")
        print(f"  Ingredients: {', '.join(meal['ingredients'])}")
        print(f"  Prep Time: {meal['prep_time']}")
        print(f"  Calories: {meal['calories']}, Protein: {meal['protein']}g, Carbs: {meal['carbs']}g, Fat: {meal['fat']}g")
    
    print(f"\nGrocery List:")
    for category, items in meal_plan2['grocery_list'].items():
        if items:
            print(f"  {category.title()}: {', '.join(items)}")
    
    print("\n" + "=" * 60)
    print("Demo completed!")

if __name__ == "__main__":
    demo_meal_generation()