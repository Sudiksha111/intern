// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db'); // your database connection
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const tenantsRoutes = require('./routes/tenants');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tenants', tenantsRoutes);

// 2. MIDDLEWARE CONFIGURATION
// ============================
// Configure Cross-Origin Resource Sharing (CORS) for security
const allowedOrigins = [
  'http://localhost:5173', // Your React dev server
  // Add your deployed Vercel frontend URL here
  'https://your-frontend-project.vercel.app' 
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

// This middleware parses incoming JSON request bodies
app.use(express.json());


// 3. DATABASE CONNECTION
// ======================
connectDB();

//  4. API ROUTES
// ===============
// A simple health check endpoint to verify the server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// --- Public Routes ---


// --- Protected Routes ---
// These routes require a valid JWT to be accessed. The 'protect' middleware handles this.
// app.use('/api/notes', protect, notesRoutes);
// app.use('/api/tenants', protect, tenantsRoutes); // Note: Specific tenant routes inside might use authorize('Admin')


// 5. START THE SERVER
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running successfully on port ${PORT}`);
});
// JWT Middleware Example (for protected routes)
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, tenantSlug }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
});

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
