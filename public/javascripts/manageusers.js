/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-undef
var xhttp = new XMLHttpRequest();

// This function will be called when the page loads. It will send a GET request to the server
// to retrieve the list of users. The server will respond with a JSON array of user objects.
// The function will then populate the table with the user data.
xhttp.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    var users = JSON.parse(this.responseText);
    var tableBody = document.querySelector("#user-table tbody");

    // Clear existing table rows
    tableBody.innerHTML = "";

    // Populate table with user data
    users.forEach(function (user) {
      var row = document.createElement("tr");
      row.innerHTML = `
        <td>${user.User_Id}</td>
        <td>${user.User_FirstName}</td>
        <td>${user.User_LastName}</td>
        <td id="user-role-${user.User_Id}">${user.User_Privileges}</td>
        <td class="no-border">
          <i class="fa fa-bars" aria-hidden="true"></i>
          <div id="management-menu">
            <div class="menu-box menu-box-${user.User_Id}">
              <button type="button" id="change-role-${user.User_Id}">Change Role</button>
              <button type="button" id="delete-user-${user.User_Id}">Delete User</button>
            </div>
          </div>
        </td>
      `;
      tableBody.appendChild(row);

      // Add event listener to the Change Role button
      var changeRoleButton = document.getElementById(`change-role-${user.User_Id}`);
      changeRoleButton.addEventListener('click', function () {
        // Create a confirmation dialog to confirm the role change
        var confirmed = confirm(`Are you sure you want to change the role for user ${user.User_Id}?`);
        if (confirmed) {
          // Define the available roles and their order
          var roles = ['user', 'manager', 'admin'];

          // Prompt the user to select the new role
          var newRole = prompt(`Select the new role for user ${user.User_Id}:\n\n${roles.join(', ')}`, user.User_Privileges);

          // Validate the new role
          if (roles.includes(newRole)) {
            // Create a new XMLHttpRequest
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                  // Role changed successfully
                  var roleElement = document.getElementById(`user-role-${user.User_Id}`);
                  roleElement.textContent = newRole;
                } else {
                  // Handle error
                }
              }
            };

            // Prepare the request
            xhr.open('POST', '/changerole', true);
            xhr.setRequestHeader('Content-type', 'application/json');

            // Prepare the data to send
            var requestData = {
              userId: user.User_Id,
              newRole: newRole
            };

            // Send the request
            xhr.send(JSON.stringify(requestData));
          } else {
            // Invalid role entered
            alert('Invalid role selected. Please try again.');
          }
        }
      });

      // Add event listener to the Delete User button
      var deleteUserButton = document.getElementById(`delete-user-${user.User_Id}`);
      deleteUserButton.addEventListener('click', function () {
        // Create a confirmation dialog to confirm the user deletion
        var confirmed = confirm(`Are you sure you want to delete user ${user.User_Id}?`);
        if (confirmed) {
          // Create a new XMLHttpRequest
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                // User deleted successfully
                // Remove the row from the table
                var tableRow = deleteUserButton.closest('tr');
                tableRow.remove();
              } else {
                // Handle error
              }
            }
          };

          // Prepare the request
          xhr.open('POST', '/deleteuser', true);
          xhr.setRequestHeader('Content-type', 'application/json');

          // Prepare the data to send
          var requestData = {
            userId: user.User_Id
          };

          // Send the request
          xhr.send(JSON.stringify(requestData));
        }
      });

    });
  } else if (this.status === 403) {
    // Display a notification to the user
    alert("Access forbidden. You do not have permission to view the users.");
    window.location.href='/main.html';
  }
};

// Retrieve the necessary DOM elements
var searchInput = document.getElementById('search-input');
var tableBody = document.getElementById('table-body');

// Add event listener to the search input
searchInput.addEventListener('input', function () {
  var searchQuery = this.value.toLowerCase();

  // Filter the table rows based on the search query
  var rows = tableBody.getElementsByTagName('tr');
  for (var i = 0; i < rows.length; i++) {
    var rowData = rows[i].textContent.toLowerCase();
    if (rowData.includes(searchQuery)) {
      rows[i].style.display = '';
    } else {
      rows[i].style.display = 'none';
    }
  }
});

xhttp.open("GET", "/manageusers", true);
xhttp.send();
