/* eslint-disable no-else-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const compSciClubMembers = new Vue({
  el: "#members-container",
  data() {
    return {
      showMembers: false
    };
  }
});

// Function to check if user is already in the RSVP list
function userAlreadyRSVPd(userId, eventId, callback) {
  var xhttp2 = new XMLHttpRequest();
  xhttp2.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var participants = JSON.parse(this.responseText);

      // Check if user is in the RSVP list
      var userAlreadyRSVP = false;
      // Loop through participants, if there is any item in the list that
      // matches the user's ID and the event's ID, then the user has already RSVP'd
      // and userAlreadyRSVP is set to true, otherwise it remains false
      participants.forEach(function (participant) {
        if (participant.User_Id === userId && participant.Event_ID === eventId) {
          userAlreadyRSVP = true;
        }
      });

      // Return result of RSVP check
      callback(null, userAlreadyRSVP);
    }
  };
  xhttp2.open("GET", "/participants", true);
  xhttp2.send();
}

// Function to add a new participant to the Event_Participants table
function addParticipant(userId, eventId) {
  var xhttp2 = new XMLHttpRequest();
  xhttp2.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log(`New participant added: ${this.responseText}`);
    }
  };
  xhttp2.open("POST", "/participants", true);
  xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp2.send(`User_Id=${encodeURIComponent(userId)}&Event_Id=${encodeURIComponent(eventId)}`);
}

// Function to remove a participant from the Event_Participants table
function removeParticipant(userId, eventId) {
  var xhttp2 = new XMLHttpRequest();
  xhttp2.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      console.log(`Participant removed: ${this.responseText}`);
    }
  };
  xhttp2.open("DELETE", "/participants", true);
  xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp2.send(`User_Id=${encodeURIComponent(userId)}&Event_Id=${encodeURIComponent(eventId)}`);
}

function getClubId(callback) {
  // Get the URL from the current page
  var currURL = window.location.href;
  // Trim the URL. If URL is http://localhost:8080/club.html, trim to club.html
  var trimmedURL = currURL.substring(currURL.lastIndexOf('/') + 1).replace(/\?.*$/, "");

  // Send a GET request to the server to get the Club_ID based on the trimmed URL
  var xhttp2 = new XMLHttpRequest();
  xhttp2.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // Get the Club_ID from the response
      var clubId = JSON.parse(this.responseText)[0].Club_ID;
      callback(null, clubId, trimmedURL);
    }
  };

  xhttp2.open("GET", `/getClubID?Club_Link=${trimmedURL}`, true);
  xhttp2.send();
}


// Function that loads Events based on the Club_ID
function loadEvents() {
  // Get the Club_ID from the URL
  getClubId(function (error, clubId) {
    if (error) {
      console.error(error); // Handle any errors that occurred during the RSVP check
    } else {
      console.log(clubId);
      // This loads the members for the club
      // This loads the events for the club
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            var events = JSON.parse(this.responseText);
            var eventsList = document.querySelector("#events-list");

            // Clear existing list items
            eventsList.innerHTML = "";

            // Populate list with event data
            events.forEach(function (event) {
              var listItem = document.createElement("li");
              listItem.innerHTML = `
          <div class="indiv-event">
              <h2>${event.Event_Name}</h2>
              <span>Date: ${event.Event_Date.split('T')[0]},</span>
              <span>Time: ${event.Event_Time},</span>
              <span>Venue: ${event.Event_Venue},</span>
              <span>Max Capacity: ${event.Event_Capacity},</span>
              <p>${event.Event_Description}</p>
          </div>
      `;
              eventsList.appendChild(listItem);

              var rsvpButton = document.createElement("button");
              rsvpButton.style.fontWeight = "bold";
              rsvpButton.style.fontSize = "1em";
              // If event is not full, button will have text RSVP
              if (event.RSVP_Count < event.Event_Capacity) {
                rsvpButton.innerHTML = "RSVP";
                rsvpButton.addEventListener("click", function () {
                  var userId = 'a1808695'; // User_Id to check
                  var joined = rsvpButton.innerHTML === "Joined";

                  // Check if user is a member of the club
                  if (userId === 'a1808695') {
                    // Check if user is not already in the RSVP list
                    userAlreadyRSVPd(userId, event.Event_ID, function (error2, hasRSVPd) {
                      if (error2) {
                        // Handle any errors that occurred during the RSVP check
                        console.error(error2);
                      } else {
                        console.log(hasRSVPd); // Use the result of the RSVP check

                        if (hasRSVPd === false) {
                          // Check if RSVP count is less than Max_Capacity
                          if (event.RSVP_Count < event.Event_Capacity) {
                            // Increase RSVP count by 1
                            event.RSVP_Count++;
                            console.log(`New RSVP Count: ${event.RSVP_Count}`);

                            // Add new entry to Event_Participants table
                            addParticipant(userId, event.Event_ID);

                            // Change button to 'Joined'
                            rsvpButton.innerHTML = "Joined";
                            rsvpButton.style.backgroundColor = "grey";
                            rsvpButton.style.color = "white";
                          } else if (event.RSVP_Count === event.Event_Capacity) {
                            // Event is full, cannot RSVP
                            console.error(`Error: Event ${event.Event_Name} is already at maximum capacity.`);
                            alert(`Error: Event ${event.Event_Name} is already at maximum capacity.`);
                          }
                        } else {
                          // User has already RSVP'd, decrease RSVP count by 1

                          // Check if user is in the RSVP list and remove the entry
                          removeParticipant(userId, event.Event_ID);

                          // Decrease RSVP count by 1
                          event.RSVP_Count--;
                          console.log(`New RSVP Count: ${event.RSVP_Count}`);

                          // Change button back to 'RSVP'
                          rsvpButton.innerHTML = "RSVP";
                          rsvpButton.style.color = "black";
                          rsvpButton.style.backgroundColor = "";
                        }
                      }
                    });
                  } else {
                    // User is not a member of the club
                    console.error(`Error: User ${userId} is not a member of the club.`);
                    alert(`Error: User ${userId} is not a member of the club.`);
                  }
                });
              } else if (event.Event_Capacity === event.RSVP_Count) {
                // If event is full, button will have text Event Full
                rsvpButton.innerHTML = "Event Full";
                rsvpButton.disabled = true;
                rsvpButton.style.backgroundColor = "grey";
                rsvpButton.style.cursor = "not-allowed";
                rsvpButton.style.color = "white";
              }

              // Append RSVP button to each event
              listItem.appendChild(rsvpButton);
            });
          } else {
            console.error(`Error loading events: ${this.responseText}`);
            alert(`Error loading events. Please try again later.`);
          }
        }
      };

      xhttp.open("GET", `/events?Club_ID=${clubId}`, true);
      xhttp.send();

    }
  });
}
// Add event listener to load events when DOM content is reloaded
document.addEventListener("DOMContentLoaded", loadEvents);

// Function to load posts based on the Club_ID
function loadPosts() {
  // Get the Club_ID from the URL
  getClubId(function (error, clubId) {
    if (error) {
      console.error(error); // Handle any errors that occurred during the RSVP check
    } else {
      console.log(clubId);
      // This loads the members for the club
      // This loads the events for the club
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            var posts = JSON.parse(this.responseText);
            var postsList = document.querySelector("#posts-list");

            // Clear existing list items
            postsList.innerHTML = "";

            // Populate list with event data
            posts.forEach(function (post) {
              var listItem = document.createElement("li");
              listItem.innerHTML = `
          <div class="indiv-post">
              <h2>${post.Post_Title}</h2>
              <span>Date: ${post.Post_Date.split('T')[0]},</span>
              <span>Time: ${post.Post_Time},</span>
              <span>Author: ${post.User_FirstName} ${post.User_LastName}</span>
              <p>${post.Post_Content}</p>
          </div>
      `;
              postsList.appendChild(listItem);
            });
          } else {
            console.error(`Error loading posts: ${this.responseText}`);
            alert(`Error loading posts. Please try again later.`);
          }
        }
      };

      xhttp.open("GET", `/posts?Club_ID=${clubId}`, true);
      xhttp.send();

    }
  });
}
// Add event listener to load posts when page loads
window.addEventListener("load", loadPosts);

function newPost() {
  var popupWindow = document.querySelector("#post-ui");
  popupWindow.style.display = "block";
}
document.querySelector("#open-post-ui").addEventListener("click", newPost);

function newEvent() {
  var popupWindow = document.querySelector("#event-ui");
  popupWindow.style.display = "block";
}
document.querySelector("#open-event-ui").addEventListener("click", newEvent);

function closePost() {
  var popupWindow = document.querySelector("#post-ui");
  popupWindow.style.display = "none";
}
document.querySelector("#post-ui span").addEventListener("click", closePost);

function closeEvent() {
  var popupWindow = document.querySelector("#event-ui");
  popupWindow.style.display = "none";
}
document.querySelector("#event-ui span").addEventListener("click", closeEvent);

function getEventCount(callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        var response = JSON.parse(this.responseText);

        // Call the callback function with the count value
        callback(response.count);
      } else {
        console.error(`Error retrieving entry count: ${this.responseText}`);
        alert(`Error retrieving entry count. Please try again later.`);
      }
    }
  };

  xhttp.open("GET", "/eventCount", true);
  xhttp.send();
}

function getPostCount(callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        var response = JSON.parse(this.responseText);

        // Call the callback function with the count value
        callback(response.count);
      } else {
        console.error(`Error retrieving entry count: ${this.responseText}`);
        alert(`Error retrieving entry count. Please try again later.`);
      }
    }
  };

  xhttp.open("GET", "/postCount", true);
  xhttp.send();
}

// This function gets the session user's ID
function getSessionUserId(callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        var response = JSON.parse(this.responseText);

        // Call the callback function with the user ID
        callback(null, response.userId);
      } else {
        console.error(`Error retrieving session user ID: ${this.responseText}`);
        alert(`Error retrieving session user ID. Please try again later.`);
      }
    }
  };

  xhttp.open("GET", "/sessionUserId", true);
  xhttp.send();
}

// This function gets the session user's role
function getUserRole(callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        var response = JSON.parse(this.responseText);

        // Call the callback function with the user role
        callback(null, response.userRole);
      } else {
        console.error(`Error retrieving session user role: ${this.responseText}`);
        alert(`Error retrieving session user role. Please try again later.`);
      }
    }
  };

  xhttp.open("GET", "/sessionUserRole", true);
  xhttp.send();
}


function submitForm(event) {
  event.preventDefault();

  // Get the input values
  var eventTitle = document.getElementById("eventTitle").value;
  var eventTime = document.getElementById("eventTime").value;
  var eventDate = document.getElementById("eventDate").value;
  var eventVenue = document.getElementById("eventVenue").value;
  var eventCapacity = document.getElementById("eventCapacity").value;
  var eventDescription = document.getElementById("eventDescription").value;

  // Get page URL
  var url = window.location.href;
  // trim the url to get the club name. If it has a ? anywhere, remove it and everything after it
  var clubName = url.substring(url.lastIndexOf('/') + 1).replace(/\?.*$/, "");
  console.log(clubName);


  // Get the Club_ID from the URL
  getClubId(function (error, clubId) {
    console.log(`Entered getClubId callback`);
    if (error) {
      console.error(error); // Handle any errors that occurred during the RSVP check
    } else {
      console.log(clubId);
      // Get event count
      getEventCount(function (count) {
        console.log(`Entered getEvent]Count callback`);
        // Create a new event
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              console.log(`Event created successfully`);
              // Reload page to display new event
              window.location.reload();
            } else {
              console.error(`Error creating event: ${this.responseText}`);
              alert(`Error creating event. Please try again later.`);
            }
          }
        };

        xhttp.open("POST", "/events", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        var data = {
          Event_ID: count + 1,
          Club_ID: clubId,
          Event_Name: eventTitle,
          Event_Time: eventTime,
          Event_Date: eventDate,
          Event_Venue: eventVenue,
          Event_Capacity: eventCapacity,
          Event_Description: eventDescription
        };
        console.log(JSON.stringify(data));
        xhttp.send(JSON.stringify(data));
      });
    }
  });
}
// Add event listener to submit button
document.querySelector("#event-ui .input-grid button").addEventListener("click", submitForm);


function submitPost(event) {
  event.preventDefault();

  // Get the input values
  var postTitle = document.getElementById("postTitle").value;
  var postTime = document.getElementById("postTime").value;
  var postDate = document.getElementById("postDate").value;
  var postDescription = document.getElementById("postContent").value;

  // Get page URL
  var url = window.location.href;
  // trim the url to get the club name. If it has a ? anywhere, remove it and everything after it
  var clubName = url.substring(url.lastIndexOf('/') + 1).replace(/\?.*$/, "");
  console.log(clubName);


  // Get the Club_ID from the URL
  getClubId(function (error, clubId) {
    console.log(`Entered getClubId callback`);
    if (error) {
      console.error(error); // Handle any errors that occurred during the RSVP check
    } else {
      console.log(clubId);
      // Get event count
      getPostCount(function (count) {
        console.log(`Post Count` + count);
        console.log(`Entered getPostCount callback`);
        // Create a new event
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState === 4) {
            if (this.status === 200) {
              console.log(`Post created successfully`);
              // Reload page to display new event
              window.location.reload();
            } else {
              console.error(`Error creating event: ${this.responseText}`);
              alert(`Error creating post. Please try again later.`);
            }
          }
        };

        xhttp.open("POST", "/posty", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        var data = {
          Post_ID: count + 1,
          Club_ID: clubId,
          Post_Title: postTitle,
          Post_Date: postDate,
          Post_Time: postTime,
          Post_Content: postDescription
        };
        console.log(JSON.stringify(data));
        xhttp.send(JSON.stringify(data));
      });
    }
  });
}
// Add event listener to submit button
document.querySelector("#post-ui .input-grid button").addEventListener("click", submitPost);


function joinClub(event) {
  event.preventDefault();

  // Get the input values
  // var user_ID
  // var given_Name
  // var family_Name
  // var email
  // var phone
  // var role


  // Get the Club_ID from the URL
  getClubId(function (error, clubId) {


  });
}
// Add event listener to submit button
document.getElementById("join-club").addEventListener("click", joinClub);

function removeUserFromClub(userId) {
  var confirmed = confirm("Are you sure you want to remove this user from the club?");
  if (confirmed) {
    getClubId(function (error, clubId) {
      if (error) {
        console.error(error);
        return;
      }
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            // User removed successfully
            window.location.reload(); // Refresh the table
          } else {
            // Handle error
            console.error("Error removing user from club");
          }
        }
      };

      xhttp.open("POST", "/removeuserfromclub", true);
      xhttp.setRequestHeader("Content-type", "application/json");

      var requestData = {
        userId: userId,
        clubId: clubId
      };

      xhttp.send(JSON.stringify(requestData));
    });
  }
}

function changeUserRole(userId) {
  var roles = ["user", "manager"]; // Available roles
  var newRole = prompt("Select the new role:\n\n" + roles.join(", "), "user");

  if (newRole && roles.includes(newRole)) {
    getClubId(function (error, clubId) {
      if (error) {
        console.error(error);
        return;
      }

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            // Role changed successfully
            window.location.reload();
          } else {
            // Handle error
            console.error("Error changing user role");
          }
        }
      };

      xhttp.open("POST", "/changerole", true);
      xhttp.setRequestHeader("Content-type", "application/json");

      var requestData = {
        userId: userId,
        clubId: clubId,
        newRole: newRole
      };

      xhttp.send(JSON.stringify(requestData));
    });
  } else {
    alert("Invalid role selected. Please try again.");
  }
}



function PopulateTable() {
  getClubId(function (error, clubId) {
    if (error) {
      console.error(error);
    } else {
      var xhttp4 = new XMLHttpRequest();
      xhttp4.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          var users = JSON.parse(this.responseText);
          var tableBody = document.getElementById("table-body");

          // Clear existing table rows
          tableBody.innerHTML = "";

          // Populate table with user data
          users.forEach(function (user) {
            var row = document.createElement("tr");
            row.innerHTML = `
              <td>${user.User_Id}</td>
              <td>${user.User_FirstName}</td>
              <td>${user.User_LastName}</td>
              <td>${user.User_Email}</td>
              <td>${user.User_PhoneNumber}</td>
              <td>${user.User_Privileges}</td>
              <td class="no-border">
                <i class="fa fa-bars" aria-hidden="true"></i>
                <div id="management-menu">
                <div class="menu-box menu-box-${user.User_Id}">
                    <button type="button" onclick="changeUserRole('${user.User_Id}')">Change Role</button>
                    <button type="button" onclick="removeUserFromClub('${user.User_Id}')">Remove User</button>
                  </div>
                </div>
              </td>
            `;
            tableBody.appendChild(row);
          });
        }
      };

      xhttp4.open("GET", "/clubmembers?clubId=" + clubId, true);
      xhttp4.send();
    }
  });
}

PopulateTable();


function CheckManager() {
  getClubId(function (error, clubId) {
    if (error) {
      console.error(error);
    } else {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          var managerData = JSON.parse(this.responseText);
          if (managerData.isManager || managerData.isAdmin) {
            // User is a manager of the current club or an admin
            var membersContainer = document.getElementById("members-container");
            membersContainer.style.display = "block";
            document.getElementById("open-event-ui").style.display = "block";
            document.getElementById("open-post-ui").style.display = "block";
          } else {
            // User is not a manager of the current club and not an admin
            console.log("User is not a manager of the club.");
            var openPostUi = document.getElementById("open-post-ui");
            var openEventUi = document.getElementById("open-event-ui");
            openPostUi.style.display = "none";
            openEventUi.style.display = "none";
          }
        }
      };

      xhttp.open("GET", "/checkmanager?clubId=" + clubId, true);
      xhttp.send();
    }
  });
}

CheckManager();
function CheckMember(){
  getClubId(function (error, clubId) {
    if (error) {
      console.error(error);
    } else {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          var userData = JSON.parse(this.responseText);
          if (userData.isManager || userData.isMember) {
            // User is a manager of the current club or a member
            console.log("User is a manager of the club or a member.");
          } else {
            // User is a manager of the current club or a member
            var joinButton = document.getElementById("become-member");
            joinButton.style.display = "block";
          }
        }
      };

      xhttp.open("GET", "/checkmember?clubId=" + clubId, true);
      xhttp.send();
    }
  });
}

CheckMember();

function joinClub() {
  getClubId(function (error, clubId) {
    if (error) {
      console.error(error);
    } else {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          window.location.reload();
        }
      };

      xhttp.open("POST", "/joinclub", true);
      xhttp.setRequestHeader("Content-type", "application/json");

      var requestData = {
        clubId: clubId
      };

      xhttp.send(JSON.stringify(requestData));
    }
  });
}

