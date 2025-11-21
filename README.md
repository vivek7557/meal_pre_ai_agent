# Enterprise Meal Prep Application

An enterprise-level meal preparation application with AI-powered recommendations, user authentication, and comprehensive meal planning features.

## Features

- User authentication and authorization
- Personalized meal plan generation based on dietary preferences
- Nutritional tracking and analysis
- Grocery list generation
- Responsive web interface
- Secure API endpoints

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: React.js with React Bootstrap
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, rate limiting

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd meal-prep-enterprise
```

2. Install server dependencies:
```bash
npm install
```

3. Navigate to client directory and install client dependencies:
```bash
cd client
npm install
```

4. Return to the root directory:
```bash
cd ..
```

5. Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
npm run dev
```

2. In a separate terminal, start the frontend development server:
```bash
cd client
npm start
```

### Production Mode

1. Build the frontend:
```bash
cd client
npm run build
```

2. Start the server:
```bash
npm start
```

The application will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth` - Get user profile (requires token)

### Users
- `GET /api/users/profile` - Get user profile (requires token)
- `PUT /api/users/profile` - Update user profile (requires token)

### Meals
- `POST /api/meals/generate` - Generate a meal plan (requires token)
- `GET /api/meals/my-plans` - Get user's meal plans (requires token)
- `GET /api/meals/:id` - Get a specific meal plan (requires token)

## Deployment

### Heroku Deployment

1. Create a Heroku app:
```bash
heroku create your-app-name
```

2. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set MONGODB_URI=your_mongodb_connection_string
```

3. Deploy:
```bash
git push heroku main
```

### Environment Variables Required for Production

- `NODE_ENV` - Set to 'production' in production
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

## Project Structure

```
/workspace/
├── server.js                 # Main server file
├── package.json             # Server dependencies
├── Procfile                 # Heroku deployment configuration
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── routes/                 # API route definitions
│   ├── auth.js
│   ├── meals.js
│   └── users.js
├── models/                 # Database models
│   ├── User.js
│   └── MealPlan.js
├── controllers/            # API controllers
├── middleware/             # Custom middleware
│   └── auth.js
├── config/                 # Configuration files
│   └── db.js
└── client/                 # Frontend React application
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   ├── auth/
    │   │   ├── profile/
    │   │   ├── meal-planner/
    │   │   └── routing/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## API Documentation

### Meal Plan Generation

Request:
```json
{
  "dietaryPreference": "vegetarian",
  "allergies": ["nuts"],
  "nutritionalGoal": "weight-loss",
  "numberOfMeals": 5,
  "preferredCuisine": "mediterranean"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": "user_id",
    "dietaryPreference": "vegetarian",
    "allergies": ["nuts"],
    "nutritionalGoal": "weight-loss",
    "numberOfMeals": 5,
    "preferredCuisine": "mediterranean",
    "meals": [
      {
        "name": "Mediterranean Breakfast Bowl",
        "description": "Greek yogurt with honey, mixed berries, and almonds",
        "ingredients": ["Greek yogurt", "Honey", "Mixed berries", "Almonds"],
        "prepTime": "10 minutes",
        "calories": 320,
        "protein": 18,
        "carbs": 28,
        "fat": 16,
        "mealType": "breakfast"
      }
    ],
    "groceryList": {
      "produce": ["Mixed berries"],
      "grains": [],
      "proteins": ["Greek yogurt", "Almonds"],
      "dairy": ["Greek yogurt"],
      "pantry": ["Honey"]
    }
  }
}
```

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation using express-validator
- Rate limiting to prevent abuse
- Helmet.js for security headers
- CORS configured for security

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.