import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/profile/Profile';
import MealPlanner from './components/meal-planner/MealPlanner';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Container className="py-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/meal-planner" element={
              <PrivateRoute>
                <MealPlanner />
              </PrivateRoute>
            } />
          </Routes>
        </Container>
        <Footer />
      </div>
    </Router>
  );
}

export default App;