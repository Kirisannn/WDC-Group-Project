/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable prefer-destructuring */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
var express = require('express');
const nodemailer = require('nodemailer');
var router = express.Router();

// Function to generate a random ID following the pattern "a1xxxxxx"
function generateRandomId() {
  var id = 'a1';
  var chars = '0123456789';
  for (var i = 0; i < 6; i++) {
    var randomIndex = Math.floor(Math.random() * chars.length);
    id += chars[randomIndex];
  }
  return id;
}

async function sendEmail(recipientEmail, message) {
  // Create a transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'adelaideclubproject@gmail.com',
      pass: 'yfeemkzofiqjlnza'
    }
  });

  // Define the email options
  let mailOptions = {
    from: 'adelaideclubproject@gmail.com',
    to: recipientEmail,
    subject: 'Adelaide Uni Clubs - Email Notification',
    text: message
  };

  try {
    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.log('Error occurred while sending email:', error);
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Get Club_ID based on Club_Link */
router.get('/getClubID', function (req, res) {
  var pool = req.pool;
  var clubLink = req.query.Club_Link;

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.sendStatus(500);
      return;
    }
    connection.query('SELECT Club_ID FROM Clubs WHERE Club_Link = ?', [clubLink], function (err, rows) {
      connection.release();
      if (err) {
        console.error('Error querying the database: ', err);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// Route to post a new event
router.post('/events', function (req, res) {
  var pool = req.pool;
  var eventData = req.body; // Extract the event data from the request body

  console.log(eventData);

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
      return;
    }

    connection.query('INSERT INTO Club_Events (Event_ID, Club_ID, Event_Name, Event_Time, Event_Date, Event_Venue, Event_Capacity, Event_Description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [eventData.Event_ID, eventData.Club_ID, eventData.Event_Name, eventData.Event_Time, eventData.Event_Date, eventData.Event_Venue, eventData.Event_Capacity, eventData.Event_Description], function (err, result) {
      connection.release();
      if (err) {
        console.error('Error querying the database: ', err);
        res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
        return;
      }

      res.status(200).json({ success: true });
    });
  });
});

router.post('/posty', function (req, res) {
  var pool = req.pool;
  var postData = req.body; // Extract the event data from the request body

  console.log(postData);

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
      return;
    }

    connection.query('INSERT INTO Club_Posts (Post_ID, Club_ID, Post_Title, Post_Date, Post_Time, Post_Content) VALUES (?, ?, ?, ?, ?, ?)', [postData.Post_ID, postData.Club_ID, postData.Post_Title, postData.Post_Date, postData.Post_Time, postData.Post_Content], function (err, result) {
      connection.release();
      if (err) {
        console.error('Error querying the database: ', err);
        res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
        return;
      }

      res.status(200).json({ success: true });
    });
  });
});

router.get('/managers', function (req, res) {
  var pool = req.pool;
  var userID = req.session.userId;
  var clubID = req.query.Club_ID;

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.sendStatus(500);
      return;
    }

    connection.query('SELECT * FROM Club_Managers WHERE Club_ID=? AND User_ID=?', [clubID, userID], function (err, rows) {
      connection.release();
      if (err) {
        console.error('Error querying the database: ', err);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});



router.get('/getuserrole', function (req, res) {
  var pool = req.pool;
  var userId = req.session.userId; // Retrieve the ID of the logged-in user from the session

  if (!userId) {
    // User is not logged in
    res.sendStatus(401); // Unauthorized
    return;
  }

  pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    connection.query('SELECT User_Privileges FROM Users WHERE User_Id = ?', [userId], function (err, rows) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (rows.length > 0) {
        res.send(rows[0].User_Privileges); // Send only the User_Privileges value
      } else {
        res.sendStatus(404); // User not found
      }
    });
  });
});

router.get('/checkmanager', function (req, res) {
  var pool = req.pool;
  var userId = req.session.userId;

  if (!userId) {
    // User is not logged in
    res.sendStatus(401); // Unauthorized
    return;
  }

  // Get the club ID from the query parameter
  var clubId = req.query.clubId;

  pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // Check if the user is a manager or admin for the given club
    connection.query(
      'SELECT * FROM Club_Managers WHERE User_Id = ? AND Club_ID = ?',
      [userId, clubId],
      function (err, managerRows) {
        if (err) {
          connection.release();
          res.sendStatus(500);
          return;
        }

        // Check if the user is an admin
        connection.query(
          'SELECT User_Privileges FROM Users WHERE User_Id = ? AND User_Privileges = "admin"',
          [userId],
          function (err, adminRows) {
            connection.release();
            if (err) {
              res.sendStatus(500);
              return;
            }

            if (managerRows.length > 0) {
              // User is a manager of the current club
              res.send({ isManager: true, clubId: clubId });
            } else if (adminRows.length > 0) {
              // User is an admin
              res.send({ isAdmin: true, clubId: clubId });
            } else {
              // User is not a manager of the current club and not an admin
              res.send({ isManager: false, isAdmin: false, clubId: clubId });
            }
          }
        );
      }
    );
  });
});

router.get('/checkmember', function (req, res) {
  var pool = req.pool;
  var userId = req.session.userId;

  if (!userId) {
    // User is not logged in
    res.sendStatus(401); // Unauthorized
    return;
  }

  // Get the club ID from the query parameter
  var clubId = req.query.clubId;

  pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // Check if the user is a member of the given club
    connection.query(
      'SELECT * FROM User_Clubs WHERE User_Id = ? AND Club_ID = ?',
      [userId, clubId],
      function (err, memberRows) {
        if (err) {
          connection.release();
          res.sendStatus(500);
          return;
        }

        // Check if the user is a manager of the given club
        connection.query(
          'SELECT * FROM Club_Managers WHERE User_Id = ? AND Club_ID = ?',
          [userId, clubId],
          function (err, managerRows) {
            connection.release();
            if (err) {
              res.sendStatus(500);
              return;
            }

            if (memberRows.length > 0) {
              // User is a member of the current club
              if (managerRows.length > 0) {
                // User is also a manager of the current club
                res.send({ isMember: true, isManager: true, clubId: clubId });
              } else {
                // User is only a member, not a manager
                res.send({ isMember: true, isManager: false, clubId: clubId });
              }
            } else {
              // User is not a member or manager of the current club
              res.send({ isMember: false, isManager: false, clubId: clubId });
            }
          }
        );
      }
    );
  });
});

router.post('/joinclub', function (req, res) {
  var pool = req.pool;
  var userId = req.session.userId;

  if (!userId) {
    // User is not logged in
    res.sendStatus(401); // Unauthorized
    return;
  }

  var clubId = req.body.clubId;

  pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // Check if the user is already a member of the club
    connection.query(
      'SELECT * FROM User_Clubs WHERE User_Id = ? AND Club_ID = ?',
      [userId, clubId],
      function (err, rows) {
        if (err) {
          connection.release();
          res.sendStatus(500);
          return;
        }

        if (rows.length > 0) {
          // User is already a member of the club
          connection.release();
          res.sendStatus(200); // Success, but user is already a member
          return;
        }

        // Add the user to the User_Clubs table
        connection.query(
          'INSERT INTO User_Clubs (User_Id, Club_ID) VALUES (?, ?)',
          [userId, clubId],
          function (err) {
            connection.release();
            if (err) {
              res.sendStatus(500);
              return;
            }

            res.sendStatus(200); // Success
          }
        );
      }
    );
  });
});



router.post('/removeuserfromclub', function (req, res) {
  var pool = req.pool;
  var userId = req.body.userId;
  var clubId = req.body.clubId;

  pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // Remove the user from the specified club in the database
    connection.query(
      'DELETE FROM User_Clubs WHERE User_Id = ? AND Club_ID = ?',
      [userId, clubId],
      function (err, result) {
        connection.release();
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.sendStatus(200); // Success
      }
    );
  });
});


router.post('/changerole', function (req, res) {
  var pool = req.pool;
  var userId = req.body.userId;
  var clubId = req.body.clubId;
  var newRole = req.body.newRole;

  pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    // Update the user's privileges in the Users table
    connection.query(
      'UPDATE Users SET User_Privileges = ? WHERE User_Id = ?',
      [newRole, userId],
      function (err, result) {
        if (err) {
          connection.release();
          console.error('manager error');
          res.sendStatus(500);
          return;
        }

        if (newRole === 'manager') {
          // Add the user as a manager in the Club_Managers table
          connection.query(
            'INSERT INTO Club_Managers (User_Id, Club_ID) VALUES (?, ?)',
            [userId, clubId],
            function (err, result) {
              connection.release();
              if (err) {
                console.error('other error', err);
                res.sendStatus(500);
                return;
              }
              res.sendStatus(200); // Success
            }
          );
        } else {
          // Remove the user from the Club_Managers table if they are not a manager
          connection.query(
            'DELETE FROM Club_Managers WHERE User_Id = ? AND Club_ID = ?',
            [userId, clubId],
            function (err, result) {
              connection.release();
              if (err) {
                console.error('deleting error');
                res.sendStatus(500);
                return;
              }
              res.sendStatus(200); // Success
            }
          );
        }
      }
    );
  });
});




/* Get events based on Club_ID */
router.get('/events', function (req, res) {
  var pool = req.pool;
  var clubID = req.query.Club_ID;

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.sendStatus(500);
      return;
    }

    connection.query('SELECT * FROM Club_Events WHERE Club_ID = ? ORDER BY Event_Date DESC', [clubID], function (err, rows) {
      connection.release();
      if (err) {
        console.error('Error querying the database: ', err);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

// Route to get the count of entries in the database
router.get('/eventCount', function (req, res) {
  var pool = req.pool;

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.sendStatus(500);
      return;
    }

    connection.query('SELECT COUNT(*) AS count FROM Club_Events', function (err, rows) {
      connection.release();
      if (err) {
        console.error('Error querying the database: ', err);
        res.sendStatus(500);
        return;
      }

      // Extract the count value from the result
      var count = rows[0].count;

      // Call the callback function with the count value
      if (req.query.callback) {
        res.send(`${req.query.callback}(${count})`);
      } else {
        res.json({ count });
      }
    });
  });
});

router.get('/postCount', function (req, res) {
  var pool = req.pool;

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.sendStatus(500);
      return;
    }

    connection.query('SELECT COUNT(*) AS count FROM Club_Posts', function (err, rows) {
      connection.release();
      if (err) {
        console.error('Error querying the database: ', err);
        res.sendStatus(500);
        return;
      }

      // Extract the count value from the result
      var count = rows[0].count;

      // Call the callback function with the count value
      if (req.query.callback) {
        res.send(`${req.query.callback}(${count})`);
      } else {
        res.json({ count });
      }
    });
  });
});

/* Get participants */
router.get('/participants', function (req, res) {
  var pool = req.pool;
  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.sendStatus(500);
      return;
    }
    connection.query('SELECT * FROM Event_Participants', function (err, rows) {
      connection.release();
      if (err) {
        console.error('Error querying the database: ', err);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

/* POST to add participant */
router.post('/participants', function (req, res) {
  var pool = req.pool;
  var userId = req.body.User_Id;
  var eventId = req.body.Event_Id;

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.sendStatus(500);
      return;
    }
    connection.query('INSERT INTO Event_Participants (User_Id, Event_Id) VALUES (?, ?)', [userId, eventId], function (err, result) {
      connection.release();
      if (err) {
        console.error('Error adding participant to the database: ', err);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200); // Participant added successfully
    });
  });
});

/* DELETE participant */
router.delete('/participants', function (req, res) {
  var pool = req.pool;
  var userId = req.body.User_Id;
  var eventId = req.body.Event_Id;

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.sendStatus(500);
      return;
    }
    connection.query('DELETE FROM Event_Participants WHERE User_Id = ? AND Event_Id = ?', [userId, eventId], function (err, result) {
      connection.release();
      if (err) {
        console.error('Error removing participant from the database: ', err);
        res.sendStatus(500);
        return;
      }
      res.sendStatus(200); // Participant removed successfully
    });
  });
});

/* PUT RSVP */
router.put('/rsvp/:eventId', function (req, res) {
  var eventId = req.params.eventId;
  var rsvpCount = req.body.rsvpCount;

  // Update the RSVP count for the event in the database
  var pool = req.pool;
  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.sendStatus(500);
      return;
    }

    var updateQuery = 'UPDATE Club_Events SET RSVP_Count = ? WHERE Event_ID = ?';
    connection.query(updateQuery, [rsvpCount, eventId], function (err, result) {
      connection.release();
      if (err) {
        console.error('Error updating RSVP count in the database: ', err);
        res.sendStatus(500);
        return;
      }

      // Return a success response
      res.sendStatus(200);
    });
  });
});

/* Get posts based on Club_ID */
router.get('/posts', function (req, res) {
  var pool = req.pool;
  var clubID = req.query.Club_ID;

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.sendStatus(500);
      return;
    }
    connection.query('SELECT * FROM Club_Posts WHERE Club_ID = ? ORDER BY Post_Date DESC', [clubID], function (err, rows) {
      connection.release();
      if (err) {
        console.error('Error querying the database: ', err);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

router.get('/clubmembers', function (req, res) {
  var pool = req.pool;
  var clubId = req.query.clubId;

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.sendStatus(500);
      return;
    }

    connection.query('SELECT U.* FROM Users U JOIN User_Clubs UC ON U.User_Id = UC.User_Id WHERE UC.Club_ID = ?', [clubId], function (err, rows) {
      connection.release();
      if (err) {
        console.error('Error executing the query: ', err);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});


router.get('/manageusers', function (req, res) {
  var pool = req.pool;
  var userId = req.session.userId;

  // Check if current user is an admin
  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.sendStatus(500);
      return;
    }
    connection.query('SELECT User_Privileges FROM Users WHERE User_Id = ?', [userId], function (err, rows) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (rows.length > 0 && rows[0].User_Privileges === 'admin') {
        // User is an admin, proceed with retrieving the user list
        pool.getConnection(function (err, connection) {
          if (err) {
            console.error('Error connecting to the database: ', err);
            res.sendStatus(500);
            return;
          }
          connection.query('SELECT * FROM Users', function (err, rows) {
            connection.release();
            if (err) {
              res.sendStatus(500);
              return;
            }
            res.json(rows);
          });
        });
      } else {
        // User is not an admin, deny access
        res.sendStatus(403); // Return a "Forbidden" status code
      }
    });
  });
});


/* POST to delete user */
router.post('/deleteuser', function (req, res) {
  var pool = req.pool;
  var userId = req.body.userId; // Assuming the user ID is sent in the request body

  pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    connection.query('DELETE FROM Users WHERE User_Id = ?', [userId], function (err, result) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (result.affectedRows > 0) {
        res.sendStatus(200); // User deleted successfully
      } else {
        res.sendStatus(404); // User not found or not deleted
      }
    });
  });
});

// delete club
router.post('/deleteclub', function (req, res) {
  var pool = req.pool;
  var clubId = req.body.clubId; // Assuming the club ID is sent in the request body

  pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    connection.query('DELETE FROM Clubs WHERE Club_ID = ?', [clubId], function (err, result) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (result.affectedRows > 0) {
        res.sendStatus(200); // Club deleted successfully
      } else {
        res.sendStatus(404); // Club not found or not deleted
      }
    });
  });
});

/* POST to change user role */
router.post('/changerole', function (req, res) {
  var pool = req.pool;
  var userId = req.body.userId; // Assuming the user ID is sent in the request body
  var newRole = req.body.newRole; // Assuming the new role is sent in the request body

  pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    connection.query('UPDATE Users SET User_Privileges = ? WHERE User_Id = ?', [newRole, userId], function (err, result) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (result.affectedRows > 0) {
        res.sendStatus(200); // Role changed successfully
      } else {
        res.sendStatus(404); // User not found or role not changed
      }
    });
  });
});

/* GET to get clubs */
router.get('/manageclubs', function (req, res) {
  console.log('Session data:', req.session);
  var pool = req.pool;
  pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    connection.query('SELECT * FROM Clubs', function (err, rows) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});


/* POST to add new user */
router.post('/signup', function (req, res) {
  var pool = req.pool;
  var userId = generateRandomId(); // user ID generated from the function
  var newRole = 'user'; // Set the role as "user" by default
  var newloggedIn = 0; // set user as logged out by default
  var newEmailNotif = 0; // set email notification as off by default
  var newEmail = req.body.email; // Assuming the new email is sent in the request body
  var newPass = req.body.password; // Assuming the new password is sent in the request body
  var newFName = req.body.firstName; // Assuming the new first name is sent in the request body
  var newLName = req.body.lastName; // Assuming the new last name is sent in the request body
  var newPhone = req.body.mnumber; // Assuming the new phone number is sent in the request body

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      return res.status(500).json({ success: false, error: 'Error connecting to the database' });
    }

    // Check if the email or phone number already exists in the database
    connection.query(
      'SELECT User_Email, User_PhoneNumber FROM Users WHERE User_Email = ? OR User_PhoneNumber = ?',
      [newEmail, newPhone],
      function (err, rows) {
        if (err) {
          console.error('Error querying the database: ', err);
          connection.release();
          return res.status(500).json({ success: false, error: 'Error querying the database' });
        }

        if (rows.length > 0 || rows.length !== 0) {
          // Existing email or phone number found
          connection.release();
          return res.status(400).json({ success: false, error: 'Email or phone number already exists' });
        }

        // Insert the new user into the database
        connection.query(
          'INSERT INTO Users (User_Id, User_Privileges, User_Email, User_Password, User_FirstName, User_LastName, User_PhoneNumber, Logged_in, Email_Notification) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)',
          // eslint-disable-next-line max-len
          [userId, newRole, newEmail, newPass, newFName, newLName, newPhone, newloggedIn, newEmailNotif],
          function (err, result) {
            connection.release();
            if (err) {
              console.error('Error adding user to the database: ', err);
              return res.status(500).json({ success: false, error: 'Error adding user to the database' });
            }
            if (result.affectedRows > 0) {
              return res.status(200).json({ success: true });
            }
            return res.status(404).json({ success: false, error: 'User not added' });
          }
        );
      }
    );
  });
});

/* POST for user to log in */
router.post('/login', function (req, res) {
  var pool = req.pool;
  var email = req.body.email; // Assuming the email is sent in the request body
  var password = req.body.password; // Assuming the password is sent in the request body

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
      return;
    }
    connection.query('SELECT * FROM Users WHERE User_Email = ?', [email], function (err, rows) {
      if (err) {
        connection.release();
        console.error('Error querying the database: ', err);
        res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
        return;
      }
      if (rows.length > 0) {
        // User found
        if (rows[0].User_Password === password) {
          // Password correct
          req.session.userId = rows[0].User_Id; // Store the user ID in the session

          // Update the logged_in field to 1
          connection.query('UPDATE Users SET Logged_in = 1 WHERE User_Id = ?', [rows[0].User_Id], function (err, result) {
            connection.release();
            if (err) {
              console.error('Error updating the logged_in field: ', err);
              res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
              return;
            }

            // Send the redirect URL in the response JSON
            res.status(200).json({
              success: true,
              user: {
                firstName: rows[0].User_FirstName,
                lastName: rows[0].User_LastName,
                email: rows[0].User_Email,
                phone: rows[0].User_PhoneNumber,
                role: rows[0].User_Privileges,
                id: rows[0].User_Id,
                loggedIn: 1 // Set the loggedIn value to 1
              }
            });
          });
        } else {
          // Password incorrect
          connection.release();
          res.status(401).json({ success: false, error: 'Incorrect password' });
        }
      } else {
        // User not found
        connection.release();
        res.status(404).json({ success: false, error: 'User not found' });
      }
    });
  });
});




/* POST for user to log out */
router.post('/logout', function (req, res) {
  var pool = req.pool;
  var userId = req.body.userId; // Assuming the user ID is sent in the request body

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error('Error connecting to the database: ', err);
      res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
      return;
    }
    connection.query('UPDATE Users SET Logged_in = 0 WHERE User_Id = ?', [userId], function (err, result) {
      connection.release();
      if (err) {
        console.error('Error updating the logged_in field: ', err);
        res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
        return;
      }
      req.session.destroy(); // Destroy the session
      res.status(200).json({ success: true });
    });
  });
});

// Route to check session data
router.get('/checkSession', function (req, res) {
  // Retrieve the session data
  var { userId } = req.session;

  if (userId) {
    // Session data exists
    res.json({ message: 'Session data found', userId, loggedIn: 1 });
  } else {
    // Session data does not exist
    res.json({ message: 'Session data not found' });
  }
});

/* GET user details */
router.get('/userdetails', function (req, res) {
  var pool = req.pool;
  var userId = req.session.userId; // Retrieve the ID of the logged-in user from the session

  if (!userId) {
    // User is not logged in
    res.sendStatus(401); // Unauthorized
    return;
  }

  pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    connection.query('SELECT * FROM Users WHERE User_Id = ?', [userId], function (err, rows) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (rows.length > 0) {
        res.json(rows[0]); // Assuming there is only one user with the given user ID
      } else {
        res.sendStatus(404); // User not found
      }
    });
  });
});

//* GET user clubs */
router.get('/userclubs', function (req, res) {
  var pool = req.pool;
  var userId = req.session.userId; // Retrieve the ID of the logged-in user from the session

  if (!userId) {
    // User is not logged in
    res.sendStatus(401); // Unauthorized
    return;
  }

  pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    connection.query('SELECT Clubs.Club_Name, Clubs.Club_Link, Clubs.Club_ID FROM User_Clubs INNER JOIN Clubs ON User_Clubs.Club_ID = Clubs.Club_ID WHERE User_Clubs.User_Id = ?', [userId], function (err, rows) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

/* POST to leave club */
router.post('/leaveclub', function (req, res) {
  var pool = req.pool;
  var clubId = req.body.clubId; // Assuming the club ID is sent in the request body
  var userId = req.session.userId; // Retrieve the ID of the logged-in user from the session

  if (!userId) {
    // User is not logged in
    res.sendStatus(401); // Unauthorized
    return;
  }

  pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    connection.query('DELETE FROM User_Clubs WHERE User_Id = ? AND Club_Id = ?', [userId, clubId], function (err, result) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (result.affectedRows > 0) {
        res.sendStatus(200); // User left club successfully
      } else {
        res.sendStatus(404); // User not found or not left club
      }
    });
  });
});

// Route to update email
router.post('/updateemail', function (req, res) {
  var pool = req.pool;
  var email = req.body.email; // Assuming the email is sent in the request body
  var userId = req.session.userId; // User ID

  if (!userId) {
    // User is not logged in
    res.sendStatus(401); // Unauthorized
    return;
  }

  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ success: false, error: 'Error connecting to the database' });
      return;
    }

    // Fetch Email_Notification and User_Email
    connection.query('SELECT Email_Notification, User_Email FROM Users WHERE User_Id = ?', [userId], function (err, rows) {
      if (err) {
        connection.release();
        res.status(500).json({ success: false, error: 'Error fetching user data from the database' });
        return;
      }

      if (rows.length > 0) {
        var emailNotification = rows[0].Email_Notification;
        var recipientEmail = rows[0].User_Email;

        connection.query('UPDATE Users SET User_Email = ? WHERE User_Id = ?', [email, userId], function (err, result) {
          connection.release();
          if (err) {
            res.status(500).json({ success: false, error: 'Error updating email in the database' });
            return;
          }

          if (result.affectedRows > 0) {
            // Email updated successfully

            if (emailNotification === 1) {
              // Call sendEmail function when Email_Notification is 1
              const message = 'Your email has been successfully updated.';
              sendEmail(recipientEmail, message)
                .then(() => {
                  res.status(200).json({ success: true });
                })
                .catch((error) => {
                  console.log('Error occurred while sending email:', error);
                  res.status(500).json({ success: false, error: 'Error sending email notification' });
                });
            } else {
              res.status(200).json({ success: true });
            }
          } else {
            res.status(404).json({ success: false, error: 'User not found or email not updated' });
          }
        });
      } else {
        connection.release();
        res.status(404).json({ success: false, error: 'User not found' });
      }
    });
  });
});

// Route to update HP
router.post('/updatehp', function (req, res) {
  var pool = req.pool;
  var hp = req.body.hp; // Assuming the HP is sent in the request body
  var userId = req.session.userId; // User ID

  if (!userId) {
    // User is not logged in
    res.sendStatus(401); // Unauthorized
    return;
  }

  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ success: false, error: 'Error connecting to the database' });
      return;
    }

    // Fetch Email_Notification and User_Email
    connection.query('SELECT Email_Notification, User_Email FROM Users WHERE User_Id = ?', [userId], function (err, rows) {
      if (err) {
        connection.release();
        res.status(500).json({ success: false, error: 'Error fetching user data from the database' });
        return;
      }

      if (rows.length > 0) {
        var emailNotification = rows[0].Email_Notification;
        var recipientEmail = rows[0].User_Email;

        connection.query('UPDATE Users SET User_PhoneNumber = ? WHERE User_Id = ?', [hp, userId], function (err, result) {
          connection.release();
          if (err) {
            res.status(500).json({ success: false, error: 'Error updating HP in the database' });
            return;
          }

          if (result.affectedRows > 0) {
            // HP updated successfully

            if (emailNotification === 1) {
              // Call sendEmail function when Email_Notification is 1
              const message = 'Your HP has been successfully updated.';
              sendEmail(recipientEmail, message)
                .then(() => {
                  res.status(200).json({ success: true });
                })
                .catch((error) => {
                  console.log('Error occurred while sending email:', error);
                  res.status(500).json({ success: false, error: 'Error sending email notification' });
                });
            } else {
              res.status(200).json({ success: true });
            }
          } else {
            res.status(404).json({ success: false, error: 'User not found or HP not updated' });
          }
        });
      } else {
        connection.release();
        res.status(404).json({ success: false, error: 'User not found' });
      }
    });
  });
});

/* POST to update email notification settings */
router.post('/notificationsettings', function (req, res) {
  var pool = req.pool;
  var userId = req.session.userId; // User ID
  var selectedCheckbox = req.body.selectedCheckbox;

  if (!userId) {
    // User is not logged in
    res.sendStatus(401); // Unauthorized
    return;
  }

  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ success: false, error: 'Error connecting to the database' });
      return;
    }

    // Determine the value for Email_Notification based on the selected checkbox
    var emailNotification = 0;
    if (selectedCheckbox === 'checkbox1') {
      emailNotification = 1; // Set the value to 1 for checkbox1 selection
    } else if (selectedCheckbox === 'checkbox2') {
      emailNotification = 0; // Set the value to 0 for checkbox2 selection
    } else {
      res.status(400).json({ success: false, error: 'Invalid checkbox selection' });
      return;
    }

    connection.query('UPDATE Users SET Email_Notification = ? WHERE User_Id = ?', [emailNotification, userId], function (err, result) {
      connection.release();
      if (err) {
        res.status(500).json({ success: false, error: 'Error updating email notification in the database' });
        return;
      }
      if (result.affectedRows > 0) {
        if (emailNotification === 1) {
          // Fetch user's email from the database
          connection.query('SELECT User_Email FROM Users WHERE User_Id = ?', [userId], function (err, rows) {
            if (err) {
              res.status(500).json({ success: false, error: 'Error fetching user email from the database' });
              return;
            }
            if (rows.length > 0) {
              var recipientEmail = rows[0].User_Email;
              const message = 'You have enabled email notifications.';
              sendEmail(recipientEmail, message)
                .then(() => {
                  res.status(200).json({ success: true });
                })
                .catch((error) => {
                  res.status(500).json({ success: false, error: 'Error sending email notification' });
                });
            } else {
              res.status(404).json({ success: false, error: 'User not found or email notification not updated' });
            }
          });
        } else {
          res.status(200).json({ success: true });
        }
      } else {
        res.status(404).json({ success: false, error: 'User not found or email notification not updated' });
      }
    });
  });
});

// Route to validate the current password
router.post('/validatepassword', function (req, res) {
  var pool = req.pool;
  var currentPassword = req.body.currentPassword;
  var userId = req.session.userId; // User ID

  if (!userId) {
    // User is not logged in
    res.sendStatus(401); // Unauthorized
    return;
  }

  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ success: false, error: 'Error connecting to the database' });
      return;
    }
    connection.query('SELECT User_Password FROM Users WHERE User_Id = ?', [userId], function (err, rows) {
      connection.release();
      if (err) {
        res.status(500).json({ success: false, error: 'Error querying the database' });
        return;
      }
      if (rows.length > 0) {
        var savedPassword = rows[0].User_Password;
        if (currentPassword === savedPassword) {
          res.status(200).json({ success: true }); // Current password matches
        } else {
          res.status(400).json({ success: false, error: 'Current password is incorrect' }); // Current password is incorrect
        }
      } else {
        res.status(404).json({ success: false, error: 'User not found' }); // User not found
      }
    });
  });
});

// Route to update password
router.post('/updatepassword', function (req, res) {
  var pool = req.pool;
  var newPassword = req.body.password; // Assuming the new password is sent in the request body
  var userId = req.session.userId; // User ID

  if (!userId) {
    // User is not logged in
    res.sendStatus(401); // Unauthorized
    return;
  }

  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ success: false, error: 'Error connecting to the database' });
      return;
    }

    // Fetch Email_Notification and User_Email
    connection.query('SELECT Email_Notification, User_Email FROM Users WHERE User_Id = ?', [userId], function (err, rows) {
      if (err) {
        connection.release();
        res.status(500).json({ success: false, error: 'Error fetching user data from the database' });
        return;
      }

      if (rows.length > 0) {
        var emailNotification = rows[0].Email_Notification;
        var recipientEmail = rows[0].User_Email;

        connection.query('UPDATE Users SET User_Password = ? WHERE User_Id = ?', [newPassword, userId], function (err, result) {
          connection.release();
          if (err) {
            res.status(500).json({ success: false, error: 'Error updating password in the database' });
            return;
          }

          if (result.affectedRows > 0) {
            // Password updated successfully

            if (emailNotification === 1) {
              // Call sendEmail function when Email_Notification is 1
              const message = 'Your password has been updated.';
              sendEmail(recipientEmail, message)
                .then(() => {
                  res.status(200).json({ success: true });
                })
                .catch((error) => {
                  console.log('Error occurred while sending email:', error);
                  res.status(500).json({ success: false, error: 'Error sending email notification' });
                });
            } else {
              res.status(200).json({ success: true });
            }
          } else {
            res.status(404).json({ success: false, error: 'User not found or password not updated' }); // User not found or password not updated
          }
        });
      } else {
        connection.release();
        res.status(404).json({ success: false, error: 'User not found' });
      }
    });
  });
});

// Route to update profile picture
router.post('/update-profile-picture', function (req, res) {
  var pool = req.pool;
  var profilePictureSrc = req.body.profilePictureSrc;
  var userId = req.session.userId; // User ID

  if (!userId) {
    // User is not logged in
    res.sendStatus(401); // Unauthorized
    return;
  }

  pool.getConnection(function (err, connection) {
    if (err) {
      res.status(500).json({ success: false, error: 'Error connecting to the database' });
      return;
    }
    connection.query('UPDATE Users SET User_PFP = ? WHERE User_Id = ?', [profilePictureSrc, userId], function (err, result) {
      connection.release();
      if (err) {
        res.status(500).json({ success: false, error: 'Error updating profile picture in the database' });
        return;
      }
      if (result.affectedRows > 0) {
        res.status(200).json({ success: true }); // Profile picture updated successfully
      } else {
        res.status(404).json({ success: false, error: 'User not found or profile picture not updated' }); // User not found or profile picture not updated
      }
    });
  });
});

module.exports = router;
