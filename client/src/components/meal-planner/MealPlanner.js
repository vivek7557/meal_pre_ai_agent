import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Tab, Tabs } from 'react-bootstrap';
import axios from 'axios';

const MealPlanner = () => {
  const [formData, setFormData] = useState({
    dietaryPreference: 'omnivore',
    allergies: '',
    nutritionalGoal: 'maintenance',
    numberOfMeals: 5,
    preferredCuisine: 'any'
  });
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('planner');

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      };

      const body = JSON.stringify({
        ...formData,
        allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a),
        numberOfMeals: parseInt(formData.numberOfMeals)
      });

      const res = await axios.post('/api/meals/generate', body, config);

      if (res.data.success) {
        setMealPlan(res.data.data);
        setActiveTab('results');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={10}>
          <Tabs
            id="meal-planner-tabs"
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="planner" title="Meal Planner">
              <Card>
                <Card.Body>
                  <h3 className="text-center mb-4">Create Your Meal Plan</h3>
                  
                  {error && <Alert variant="danger">{error}</Alert>}
                  
                  <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="formDietaryPreference">
                      <Form.Label>Dietary Preference</Form.Label>
                      <Form.Select
                        name="dietaryPreference"
                        value={formData.dietaryPreference}
                        onChange={onChange}
                        required
                      >
                        <option value="omnivore">Omnivore</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="keto">Keto</option>
                        <option value="gluten-free">Gluten-Free</option>
                        <option value="pescatarian">Pescatarian</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formAllergies">
                      <Form.Label>Allergies (comma separated)</Form.Label>
                      <Form.Control
                        type="text"
                        name="allergies"
                        value={formData.allergies}
                        onChange={onChange}
                        placeholder="e.g., nuts, dairy, gluten"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formNutritionalGoal">
                      <Form.Label>Nutritional Goal</Form.Label>
                      <Form.Select
                        name="nutritionalGoal"
                        value={formData.nutritionalGoal}
                        onChange={onChange}
                        required
                      >
                        <option value="maintenance">Maintenance</option>
                        <option value="weight-loss">Weight Loss</option>
                        <option value="muscle-gain">Muscle Gain</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formNumberOfMeals">
                      <Form.Label>Number of Meals</Form.Label>
                      <Form.Control
                        type="number"
                        name="numberOfMeals"
                        value={formData.numberOfMeals}
                        onChange={onChange}
                        min="1"
                        max="14"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPreferredCuisine">
                      <Form.Label>Preferred Cuisine</Form.Label>
                      <Form.Control
                        type="text"
                        name="preferredCuisine"
                        value={formData.preferredCuisine}
                        onChange={onChange}
                        placeholder="e.g., Mediterranean, Asian, Italian"
                        required
                      />
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={loading}
                      className="w-100"
                    >
                      {loading ? 'Generating Meal Plan...' : 'Generate Meal Plan'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Tab>
            
            {mealPlan && (
              <Tab eventKey="results" title="Results">
                <Card>
                  <Card.Body>
                    <h3 className="text-center mb-4">Your Meal Plan</h3>
                    
                    <div className="mb-4">
                      <h5>Meals:</h5>
                      {mealPlan.meals.map((meal, index) => (
                        <Card key={index} className="mb-3">
                          <Card.Header>
                            <strong>{meal.name}</strong> - {meal.mealType} | Prep Time: {meal.prepTime}
                          </Card.Header>
                          <Card.Body>
                            <p>{meal.description}</p>
                            <p><strong>Ingredients:</strong> {meal.ingredients.join(', ')}</p>
                            <div className="d-flex justify-content-between">
                              <span><strong>Calories:</strong> {meal.calories}</span>
                              <span><strong>Protein:</strong> {meal.protein}g</span>
                              <span><strong>Carbs:</strong> {meal.carbs}g</span>
                              <span><strong>Fat:</strong> {meal.fat}g</span>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                    
                    <div>
                      <h5>Grocery List:</h5>
                      <Row>
                        {Object.entries(mealPlan.groceryList).map(([category, items]) => (
                          items.length > 0 && (
                            <Col key={category} md={6} lg={4} className="mb-3">
                              <Card>
                                <Card.Header>
                                  <strong>{category.charAt(0).toUpperCase() + category.slice(1)}</strong>
                                </Card.Header>
                                <Card.Body>
                                  <ul className="list-unstyled">
                                    {items.map((item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ))}
                                  </ul>
                                </Card.Body>
                              </Card>
                            </Col>
                          )
                        ))}
                      </Row>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>
            )}
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default MealPlanner;