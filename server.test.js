// Simple test file to verify the API functionality
const request = require('supertest');
const app = require('./server');

describe('API Endpoints', () => {
  // Test the root route
  test('GET / should return 404 since no root route is defined', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(404);
  });

  // Test the auth routes exist
  test('POST /api/auth/register should return 400 for invalid data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/login should return 400 for invalid data', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.status).toBe(400);
  });

  // Test the meals route requires auth
  test('POST /api/meals/generate should return 401 without auth token', async () => {
    const res = await request(app)
      .post('/api/meals/generate')
      .send({
        dietaryPreference: 'vegetarian',
        allergies: [],
        nutritionalGoal: 'weight-loss',
        numberOfMeals: 5,
        preferredCuisine: 'mediterranean'
      });
    expect(res.status).toBe(401);
  });
});