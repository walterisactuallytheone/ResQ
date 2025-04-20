const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB with additional options and debug logging
console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Log URI without exposing password

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully');
    // Start the server only after successful database connection
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      
      // Start the reminder scheduler
      const reminderService = require('./server/services/reminderService');
      reminderService.startScheduler();
    });
  })
  .catch(err => {
    console.error('MongoDB connection error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Make user data available to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!req.session.user;
  next();
});

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Home | ResQ',
    page: 'home' 
  });
});

app.get('/about', (req, res) => {
  res.render('about', { 
    title: 'About Us | ResQ',
    page: 'about'
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login | ResQ',
    page: 'login'
  });
});

app.get('/sign-up', (req, res) => {
  res.render('sign-up', {
    title: 'Sign Up | ResQ',
    page: 'sign-up'
  });
});

app.get('/med-reminder', (req, res) => {
  res.render('med-reminder', { 
    title: 'Med Reminder | ResQ',
    page: 'med-reminder'
  });
});

app.get('/appointment', (req, res) => {
  res.render('appointment', { 
    title: 'Appointment | ResQ',
    page: 'appointment'
  });
});

app.get('/ambulance', (req, res) => {
  res.render('ambulance', { 
    title: 'Book Ambulance | ResQ',
    page: 'ambulance'
  });
});

app.get('/track-ambulance', (req, res) => {
  res.render('track-ambulance', { 
    title: 'Track Ambulance | ResQ',
    page: 'ambulance' // Keep 'ambulance' to maintain nav highlighting
  });
});

// Route directly to the auth routes for the logout page
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

// Add API routes
const reminderRoutes = require('./server/routes/reminderRoutes');
const authRoutes = require('./server/routes/authRoutes');
const appointmentRoutes = require('./server/routes/appointmentRoutes');
const medicationRoutes = require('./server/routes/medicationRoutes');
const ambulanceRoutes = require('./server/routes/ambulanceRoutes');

app.use('/api/reminders', reminderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/ambulance', ambulanceRoutes); 