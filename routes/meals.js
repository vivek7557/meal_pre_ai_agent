const express = require('express');
const auth = require('../middleware/auth');
const MealPlan = require('../models/MealPlan');
const User = require('../models/User');
const router = express.Router();

// @route   POST api/meals/generate
// @desc    Generate meal plan based on user preferences
// @access  Private
router.post('/generate', auth, async (req, res) => {
  try {
    const { dietaryPreference, allergies, nutritionalGoal, numberOfMeals, preferredCuisine } = req.body;

    // Get user's profile
    const user = await User.findById(req.user.id).select('-password');
    
    // Generate meal plan based on user preferences
    const mealPlan = await generateMealPlan({
      dietaryPreference,
      allergies,
      nutritionalGoal,
      numberOfMeals,
      preferredCuisine
    });

    // Create meal plan document
    const newMealPlan = new MealPlan({
      user: req.user.id,
      dietaryPreference,
      allergies,
      nutritionalGoal,
      numberOfMeals,
      preferredCuisine,
      meals: mealPlan.meals,
      groceryList: mealPlan.groceryList
    });

    const savedMealPlan = await newMealPlan.save();

    res.json({
      success: true,
      data: savedMealPlan
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET api/meals/my-plans
// @desc    Get user's meal plans
// @access  Private
router.get('/my-plans', auth, async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user', ['name', 'email']);

    res.json({
      success: true,
      data: mealPlans
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET api/meals/:id
// @desc    Get a specific meal plan
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id)
      .populate('user', ['name', 'email']);

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    // Check if user owns the meal plan
    if (mealPlan.user._id.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authorized'
      });
    }

    res.json({
      success: true,
      data: mealPlan
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Helper function to generate meal plan
async function generateMealPlan({ dietaryPreference, allergies, nutritionalGoal, numberOfMeals, preferredCuisine }) {
  // This is a simplified version - in a real app, this would connect to an AI service
  const meals = [];
  const groceryList = {
    produce: [],
    grains: [],
    proteins: [],
    dairy: [],
    pantry: []
  };

  // Sample meal generation based on preferences
  for (let i = 0; i < numberOfMeals; i++) {
    const mealType = i % 4 === 0 ? 'breakfast' : 
                    i % 4 === 1 ? 'lunch' : 
                    i % 4 === 2 ? 'dinner' : 'snack';
    
    const meal = generateMeal(mealType, dietaryPreference, preferredCuisine, nutritionalGoal);
    meals.push(meal);
    
    // Add ingredients to grocery list
    addToGroceryList(groceryList, meal.ingredients);
  }

  return {
    meals,
    groceryList
  };
}

// Helper function to generate a single meal
function generateMeal(mealType, dietaryPreference, cuisine, goal) {
  // This is a simplified version with sample data
  const baseMeals = {
    breakfast: {
      name: "Mediterranean Breakfast Bowl",
      description: "Greek yogurt with honey, mixed berries, and almonds",
      ingredients: ["Greek yogurt", "Honey", "Mixed berries", "Almonds"],
      prepTime: "10 minutes",
      calories: 320,
      protein: 18,
      carbs: 28,
      fat: 16
    },
    lunch: {
      name: "Quinoa Mediterranean Salad",
      description: "Quinoa with chickpeas, cucumber, tomatoes, olives, and feta",
      ingredients: ["Quinoa", "Chickpeas", "Cucumber", "Tomatoes", "Olives", "Feta cheese"],
      prepTime: "20 minutes",
      calories: 450,
      protein: 16,
      carbs: 58,
      fat: 18
    },
    dinner: {
      name: "Herb-Crusted Salmon with Roasted Vegetables",
      description: "Salmon with herbs and roasted Mediterranean vegetables",
      ingredients: ["Salmon", "Herbs", "Zucchini", "Eggplant", "Bell peppers", "Olive oil"],
      prepTime: "30 minutes",
      calories: 520,
      protein: 32,
      carbs: 18,
      fat: 32
    },
    snack: {
      name: "Mediterranean Hummus with Veggies",
      description: "Homemade hummus with fresh vegetables",
      ingredients: ["Chickpeas", "Tahini", "Lemon", "Garlic", "Carrots", "Cucumber"],
      prepTime: "15 minutes",
      calories: 180,
      protein: 6,
      carbs: 20,
      fat: 9
    }
  };

  return baseMeals[mealType];
}

// Helper function to add ingredients to grocery list
function addToGroceryList(groceryList, ingredients) {
  ingredients.forEach(ingredient => {
    // Simple categorization - in a real app this would be more sophisticated
    if (['Greek yogurt', 'Feta cheese'].includes(ingredient)) {
      groceryList.dairy.push(ingredient);
    } else if (['Quinoa', 'Rice', 'Pasta'].includes(ingredient)) {
      groceryList.grains.push(ingredient);
    } else if (['Chickpeas', 'Salmon', 'Almonds'].includes(ingredient)) {
      groceryList.proteins.push(ingredient);
    } else if (['Tomatoes', 'Cucumber', 'Carrots', 'Bell peppers', 'Zucchini', 'Eggplant'].includes(ingredient)) {
      groceryList.produce.push(ingredient);
    } else {
      groceryList.pantry.push(ingredient);
    }
  });
}

module.exports = router;