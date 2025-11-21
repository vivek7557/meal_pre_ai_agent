import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dietaryPreference: 'omnivore',
    allergies: '',
    nutritionalGoal: 'maintenance',
    preferredCuisine: 'any'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      const res = await axios.get('/api/users/profile', config);
      if (res.data.success) {
        setUser(res.data.data);
        setFormData({
          name: res.data.data.name || '',
          email: res.data.data.email || '',
          dietaryPreference: res.data.data.dietaryPreference || 'omnivore',
          allergies: res.data.data.allergies ? res.data.data.allergies.join(', ') : '',
          nutritionalGoal: res.data.data.nutritionalGoal || 'maintenance',
          preferredCuisine: res.data.data.preferredCuisine || 'any'
        });
      }
    } catch (err) {
      setError('Error loading profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
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
        allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a)
      });

      const res = await axios.put('/api/users/profile', body, config);

      if (res.data.success) {
        setSuccess('Profile updated successfully');
        setError('');
        
        // Update user data
        setUser(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setSuccess('');
    }
  };

  if (loading) {
    return (
      <Container>
        <Row className="justify-content-center mt-5">
          <Col md={6}>
            <div className="text-center">Loading...</div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <h2 className="text-center mb-4">Your Profile</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Card>
            <Card.Body>
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDietaryPreference">
                  <Form.Label>Dietary Preference</Form.Label>
                  <Form.Select
                    name="dietaryPreference"
                    value={formData.dietaryPreference}
                    onChange={onChange}
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
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPreferredCuisine">
                  <Form.Label>Preferred Cuisine</Form.Label>
                  <Form.Control
                    type="text"
                    name="preferredCuisine"
                    value={formData.preferredCuisine}
                    onChange={onChange}
                    placeholder="e.g., Mediterranean, Asian, Italian"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Update Profile
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;