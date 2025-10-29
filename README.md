# Newspaper Subscription App

A full-stack mobile application for newspaper subscriptions with customer and distributor modules, built with React Native, Node.js, Express, and MongoDB.

## Features

### Customer Module
- User registration and authentication (JWT)
- Browse available newspapers
- Subscribe to newspapers with multiple plans (monthly, quarterly, yearly)
- Manage subscriptions
- Secure payment integration with Razorpay
- Real-time notifications via Twilio SMS
- Track delivery status
- Update delivery address and preferences

### Distributor Module
- Distributor registration and authentication
- View assigned delivery routes
- Manage customer subscriptions
- Update delivery status
- Receive notifications for new subscriptions

### Admin Module
- Manage newspapers
- View subscription statistics
- Manage users (customers and distributors)
- Process refunds
- View payment reports

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Razorpay** - Payment gateway
- **Twilio** - SMS notifications
- **Bcrypt** - Password hashing

### Frontend
- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation
- **React Native Paper** - UI components
- **Axios** - HTTP client
- **AsyncStorage** - Local storage

## Project Structure

```
newspaper-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── subscriptionController.js
│   │   ├── paymentController.js
│   │   └── newspaperController.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── newspaperModel.js
│   │   ├── subscriptionModel.js
│   │   └── paymentModel.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── subscriptionRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── newspaperRoutes.js
│   ├── utils/
│   │   ├── appError.js
│   │   ├── catchAsync.js
│   │   ├── email.js
│   │   └── twilio.js
│   ├── .env
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── config/
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── SubscriptionContext.js
    │   ├── navigation/
    │   │   ├── AppNavigator.js
    │   │   ├── AuthNavigator.js
    │   │   └── MainNavigator.js
    │   ├── screens/
    │   │   ├── auth/
    │   │   │   ├── LoginScreen.js
    │   │   │   ├── SignupScreen.js
    │   │   │   └── ForgotPasswordScreen.js
    │   │   ├── HomeScreen.js
    │   │   ├── NewspaperDetailScreen.js
    │   │   ├── CheckoutScreen.js
    │   │   ├── SubscriptionsScreen.js
    │   │   ├── SubscriptionDetailScreen.js
    │   │   ├── ProfileScreen.js
    │   │   └── LoadingScreen.js
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── subscriptionService.js
    │   │   ├── paymentService.js
    │   │   └── newspaperService.js
    │   └── theme/
    │       └── theme.js
    ├── App.js
    ├── app.json
    ├── babel.config.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Expo CLI
- Razorpay account
- Twilio account

### Backend Setup

1. Navigate to the backend directory:
```bash
cd newspaper-app/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file and configure environment variables:
```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/newspaper-app?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Frontend URL
FRONTEND_URL=http://localhost:19006
```

4. Start the development server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd newspaper-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the API configuration in `src/config/index.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://your-backend-url/api/v1',
  TIMEOUT: 10000,
};

export const RAZORPAY_CONFIG = {
  KEY_ID: 'your_razorpay_key_id',
};
```

4. Start the Expo development server:
```bash
npm start
```

5. Run on your device:
- Scan the QR code with Expo Go app (Android/iOS)
- Press `a` for Android emulator
- Press `i` for iOS simulator

## API Endpoints

### Authentication
- `POST /api/v1/users/signup` - Register new user
- `POST /api/v1/users/login` - Login user
- `GET /api/v1/users/logout` - Logout user
- `POST /api/v1/users/forgotPassword` - Request password reset
- `PATCH /api/v1/users/resetPassword/:token` - Reset password

### Users
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/updateMe` - Update current user
- `PATCH /api/v1/users/updateMyPassword` - Update password
- `GET /api/v1/users/my-subscriptions` - Get user subscriptions
- `GET /api/v1/users/my-distribution-list` - Get distributor deliveries

### Newspapers
- `GET /api/v1/newspapers` - Get all newspapers
- `GET /api/v1/newspapers/:id` - Get newspaper by ID
- `POST /api/v1/newspapers` - Create newspaper (admin)
- `PATCH /api/v1/newspapers/:id` - Update newspaper (admin)
- `DELETE /api/v1/newspapers/:id` - Delete newspaper (admin)

### Subscriptions
- `GET /api/v1/subscriptions` - Get all subscriptions
- `GET /api/v1/subscriptions/:id` - Get subscription by ID
- `POST /api/v1/subscriptions` - Create subscription
- `PATCH /api/v1/subscriptions/:id` - Update subscription
- `DELETE /api/v1/subscriptions/:id` - Cancel subscription

### Payments
- `POST /api/v1/payments/create-order` - Create Razorpay order
- `POST /api/v1/payments/verify` - Verify payment
- `GET /api/v1/payments/:id` - Get payment details
- `POST /api/v1/payments/refund` - Process refund (admin)

## Database Models

### User
- name, email, phone, password
- role (customer, distributor, admin)
- address with geolocation

### Newspaper
- name, description, publisher
- languages, categories
- pricing (monthly, quarterly, yearly)
- ratings and reviews

### Subscription
- user, newspaper, distributor
- start date, end date, status
- delivery address, delivery time
- payment reference

### Payment
- subscription, user
- payment ID, order ID, signature
- amount, currency, status
- refund details

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation
- Rate limiting (recommended)
- CORS configuration
- Secure payment processing

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Update MongoDB connection string
3. Deploy using Git or CLI

### Frontend Deployment (Expo)
1. Build for production:
```bash
expo build:android
expo build:ios
```

2. Submit to app stores or use Expo Go

## Environment Variables

### Required Backend Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `RAZORPAY_KEY_ID` - Razorpay API key
- `RAZORPAY_KEY_SECRET` - Razorpay secret
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number

### Required Frontend Variables
- `BASE_URL` - Backend API URL
- `RAZORPAY_KEY_ID` - Razorpay public key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@newspaperapp.com or create an issue in the repository.

## Acknowledgments

- React Native community
- Express.js documentation
- MongoDB documentation
- Razorpay API documentation
- Twilio API documentation
