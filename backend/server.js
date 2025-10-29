const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;

// Debug: Log the raw MONGO_URI to see what we're getting
console.log('Raw MONGO_URI:', process.env.MONGO_URI);

// Remove quotes if they exist and handle password replacement
let DB = process.env.MONGO_URI;
if (DB) {
  // Remove surrounding quotes if present
  DB = DB.replace(/^["']|["']$/g, '');
  
  // Replace password placeholder if it exists
  if (DB.includes('<PASSWORD>') && process.env.MONGO_PASSWORD) {
    DB = DB.replace('<PASSWORD>', process.env.MONGO_PASSWORD);
  }
  
  // Handle passwords wrapped in angle brackets (e.g., <password>)
  // Extract and URL-encode the password
  const passwordMatch = DB.match(/<([^>]+)>/);
  if (passwordMatch) {
    const password = passwordMatch[1];
    const encodedPassword = encodeURIComponent(password);
    DB = DB.replace(`<${password}>`, encodedPassword);
  }
}

console.log('Processed DB URI:', DB ? DB.substring(0, 20) + '...' : 'undefined');

// Connect to MongoDB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => {
    console.error('DB connection error:', err);
    process.exit(1);
  });

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
