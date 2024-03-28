/* eslint-disable linebreak-style */
/* eslint-disable no-console */
var createError = require('http-errors');
var session = require('express-session');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var dbConnectionPool = mysql.createPool({ host: 'localhost', database: 'our_database' });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Configure session middleware
app.use(session({
  secret: 'WDC-WEBSITE-SECURITY-KEY', // secret key
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Change to "true" if using HTTPS
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    sameSite: 'none'
  }
}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  req.pool = dbConnectionPool;
  next();
});

app.get('/getUserId', function (req, res) {
  // Retrieve the user ID from the session
  var { userId } = req.session;

  // Return the user ID as the response
  res.json({ userId });
});

app.post('/logout', function (req, res) {
  var { pool } = req;
  var { userId } = req.session; // Assuming the user ID is stored in the session

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
      return;
    }

    connection.query('UPDATE Users SET Logged_in = 0 WHERE User_Id = ?', [userId], function (queryErr, result) {
      connection.release();
      if (queryErr) {
        console.error('Error updating the Logged_in field: ', queryErr);
        res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
        return;
      }

      req.session.destroy(function (destroyErr) {
        if (destroyErr) {
          console.error('Error destroying the session: ', destroyErr);
          res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
          return;
        }

        res.status(200).json({ success: true });
      });
    });
  });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
