# Quick Start Guide - 5 Minutes Setup

## Prerequisites Check
- [ ] Node.js installed (v14+)
- [ ] MongoDB running (local or Atlas)
- [ ] Expo CLI installed globally
- [ ] Expo Go app on your phone

## Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd newspaper-app/backend

# Install dependencies
npm install

# Configure .env file
# Open .env and update:
# - MONGO_URI (your MongoDB connection string)
# - JWT_SECRET (any random string)
# - Other API keys (optional for testing)

# Start backend server
npm run dev
```

**Expected Output:**
```
Server running on port 5000...
DB connection successful!
```

## Step 2: Add Sample Data (30 seconds)

```bash
# In backend directory
node seedData.js --import
```

**Expected Output:**
```
✅ Sample newspapers imported successfully!
📰 Total newspapers added: 10
```

## Step 3: Frontend Setup (2 minutes)

```bash
# Open new terminal
cd newspaper-app/frontend

# Install dependencies
npm install

# Update API URL in src/config/index.js
# Change BASE_URL to: http://YOUR_LOCAL_IP:5000/api/v1
# Example: http://192.168.1.100:5000/api/v1

# Start Expo
npm start
```

## Step 4: Run on Phone (30 seconds)

1. Open Expo Go app on your phone
2. Scan the QR code from terminal
3. Wait for app to load

## Step 5: Test the App (1 minute)

1. **Sign Up:**
   - Name: Test User
   - Email: test@example.com
   - Phone: +919876543210
   - Role: Customer
   - Password: test1234

2. **Browse Newspapers:**
   - You'll see 10 sample newspapers
   - Click on any to view details

3. **Create Subscription:**
   - Select a plan
   - Fill delivery address
   - Click "Proceed to Payment"
   - Click "Simulate Success" in the alert

4. **View Subscriptions:**
   - Go to "Subscriptions" tab
   - See your active subscription

## Troubleshooting

### Backend won't start
```bash
# Check if MongoDB is running
# For local MongoDB:
mongod

# For Atlas: Check connection string in .env
```

### Frontend can't connect to backend
```bash
# Find your local IP:
# Windows:
ipconfig

# Mac/Linux:
ifconfig

# Update src/config/index.js with your IP
```

### Port 5000 already in use
```bash
# Change PORT in backend/.env to 5001
# Update frontend config to use :5001
```

## Quick Commands Reference

```bash
# Backend
cd backend
npm run dev              # Start development server
node seedData.js --import   # Add sample data
node seedData.js --delete   # Remove all data

# Frontend
cd frontend
npm start                # Start Expo
npm start -- --clear     # Clear cache and start
```

## Test Credentials

**Customer Account:**
- Email: test@example.com
- Password: test1234

**Distributor Account:**
- Email: distributor@example.com
- Password: test1234

## Next Steps

1. ✅ App is running
2. 📱 Test all features
3. 🎨 Customize UI/theme
4. 🔧 Add more newspapers
5. 🚀 Deploy to production

## Need Help?

- Check README.md for detailed documentation
- See SETUP_GUIDE.md for step-by-step instructions
- Review API_DOCUMENTATION.md for API details
- Check PROJECT_SUMMARY.md for project overview

---

**Total Setup Time: ~5 minutes** ⚡

Happy coding! 🎉
