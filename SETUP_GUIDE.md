# Newspaper Subscription App - Setup Guide

## Quick Start Guide

### Step 1: Install Prerequisites

1. **Node.js** (v14 or higher)
   - Download from https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB**
   - Option A: Local installation from https://www.mongodb.com/try/download/community
   - Option B: MongoDB Atlas (cloud) from https://www.mongodb.com/cloud/atlas

3. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

4. **Expo Go App** (on your mobile device)
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

### Step 2: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd newspaper-app/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Open `.env` file
   - Update the following:

   ```env
   # MongoDB - Replace with your connection string
   MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/newspaper-app

   # JWT - Generate a random secret key
   JWT_SECRET=your_super_secret_jwt_key_here

   # Razorpay - Get from https://dashboard.razorpay.com/
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx

   # Twilio - Get from https://www.twilio.com/console
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxx
   TWILIO_PHONE_NUMBER=+1234567890
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   Server running on port 5000...
   DB connection successful!
   ```

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd newspaper-app/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint:**
   - Open `src/config/index.js`
   - Update `BASE_URL`:

   ```javascript
   export const API_CONFIG = {
     BASE_URL: 'http://YOUR_LOCAL_IP:5000/api/v1',  // e.g., http://192.168.1.100:5000/api/v1
     TIMEOUT: 10000,
   };

   export const RAZORPAY_CONFIG = {
     KEY_ID: 'rzp_test_xxxxxxxxxxxxx',  // Same as backend
   };
   ```

   **Important:** Use your local IP address, not `localhost`, for mobile testing.
   - Windows: Run `ipconfig` and look for IPv4 Address
   - Mac/Linux: Run `ifconfig` and look for inet address

4. **Start the Expo development server:**
   ```bash
   npm start
   ```

5. **Run the app:**
   - Scan the QR code with Expo Go app (Android)
   - Scan with Camera app (iOS) - it will open in Expo Go
   - Or press `a` for Android emulator / `i` for iOS simulator

### Step 4: Test the Application

1. **Create a test account:**
   - Open the app on your device
   - Click "Sign Up"
   - Fill in the details:
     - Name: Test User
     - Email: test@example.com
     - Phone: +919876543210
     - Role: Customer
     - Password: test1234

2. **Browse newspapers:**
   - After login, you'll see the home screen
   - Browse available newspapers (you'll need to add some via API or admin panel)

3. **Create a subscription:**
   - Click on a newspaper
   - Select a plan
   - Fill in delivery address
   - Proceed to payment

## Getting API Keys

### MongoDB Atlas (Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `<dbname>` with `newspaper-app`

### Razorpay (Test Mode)

1. Go to https://dashboard.razorpay.com/signup
2. Sign up for an account
3. Go to Settings → API Keys
4. Generate Test Keys
5. Copy Key ID and Key Secret
6. Add to `.env` file

### Twilio (Trial Account)

1. Go to https://www.twilio.com/try-twilio
2. Sign up for a free trial account
3. Verify your phone number
4. Go to Console Dashboard
5. Copy Account SID and Auth Token
6. Get a trial phone number
7. Add to `.env` file

**Note:** In development mode, SMS notifications are logged to console instead of being sent.

## Adding Sample Newspapers

You can add newspapers via API or create a seed script. Here's a sample POST request:

```bash
POST http://localhost:5000/api/v1/newspapers
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "name": "The Times of India",
  "description": "India's leading English daily newspaper",
  "publisher": "Bennett, Coleman & Co. Ltd.",
  "languages": ["English"],
  "categories": ["daily", "business", "sports"],
  "price": {
    "monthly": 300,
    "quarterly": 850,
    "yearly": 3200
  },
  "coverImage": "https://example.com/toi-cover.jpg",
  "images": ["https://example.com/toi-1.jpg"]
}
```

## Troubleshooting

### Backend Issues

**Problem:** Cannot connect to MongoDB
- **Solution:** Check your MongoDB connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas (Network Access)

**Problem:** Port 5000 already in use
- **Solution:** Change PORT in `.env` to another port (e.g., 5001)

### Frontend Issues

**Problem:** Cannot connect to backend API
- **Solution:** 
  - Use your local IP address, not `localhost`
  - Ensure backend is running
  - Check firewall settings

**Problem:** Expo app not loading
- **Solution:**
  - Clear Expo cache: `expo start -c`
  - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

**Problem:** Module not found errors
- **Solution:** Run `npm install` again in the frontend directory

## Development Tips

1. **Hot Reload:** Both backend (nodemon) and frontend (Expo) support hot reload
2. **Debugging:** Use React Native Debugger or Chrome DevTools
3. **API Testing:** Use Postman or Thunder Client for testing API endpoints
4. **Database GUI:** Use MongoDB Compass to view/edit database

## Project Structure Overview

```
newspaper-app/
├── backend/              # Node.js + Express backend
│   ├── controllers/      # Business logic
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
└── frontend/            # React Native app
    ├── src/
    │   ├── context/     # State management
    │   ├── navigation/  # App navigation
    │   ├── screens/     # UI screens
    │   ├── services/    # API calls
    │   └── theme/       # Styling
    └── App.js           # Root component
```

## Next Steps

1. **Add more newspapers** to the database
2. **Test payment flow** with Razorpay test cards
3. **Configure SMS notifications** with Twilio
4. **Add distributor accounts** for delivery management
5. **Customize the UI** to match your brand

## Support

If you encounter any issues:
1. Check the console logs (backend and frontend)
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check the README.md for detailed API documentation

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production` in backend
2. Use production MongoDB cluster
3. Enable Razorpay live mode
4. Build production app: `expo build:android` / `expo build:ios`
5. Deploy backend to Heroku, Railway, or AWS

---

Happy coding! 🚀
