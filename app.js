const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session'); // for session management
const csrf = require('csurf'); // for CSRF protection
const blogRoutes = require('./routes/blogRoutes');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://tonyuft4002:dasturchi@cluster0.gfehr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbURI)
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Session middleware
app.use(session({
  secret: 'your-secret-key', // Change this to a strong secret key
  resave: false,
  saveUninitialized: true,
}));

// CSRF protection middleware
const csrfProtection = csrf();
app.use(csrfProtection);

// pass CSRF token to the views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.path = req.path;
  next();
});

// routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// blog routes
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});