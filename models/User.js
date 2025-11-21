const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dietaryPreference: {
    type: String,
    enum: ['vegetarian', 'vegan', 'keto', 'gluten-free', 'omnivore', 'pescatarian', 'other'],
    default: 'omnivore'
  },
  allergies: [{
    type: String
  }],
  nutritionalGoal: {
    type: String,
    enum: ['weight-loss', 'muscle-gain', 'maintenance', 'other'],
    default: 'maintenance'
  },
  preferredCuisine: {
    type: String,
    default: 'any'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);