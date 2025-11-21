const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dietaryPreference: {
    type: String,
    required: true
  },
  allergies: [{
    type: String
  }],
  nutritionalGoal: {
    type: String,
    required: true
  },
  numberOfMeals: {
    type: Number,
    required: true
  },
  preferredCuisine: {
    type: String,
    required: true
  },
  meals: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    ingredients: [{
      type: String,
      required: true
    }],
    prepTime: {
      type: String,
      required: true
    },
    calories: {
      type: Number,
      required: true
    },
    protein: {
      type: Number,
      required: true
    },
    carbs: {
      type: Number,
      required: true
    },
    fat: {
      type: Number,
      required: true
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      default: 'lunch'
    }
  }],
  groceryList: {
    produce: [{
      type: String
    }],
    grains: [{
      type: String
    }],
    proteins: [{
      type: String
    }],
    dairy: [{
      type: String
    }],
    pantry: [{
      type: String
    }]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MealPlan', MealPlanSchema);