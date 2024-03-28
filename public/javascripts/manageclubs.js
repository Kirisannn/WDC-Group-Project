/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-undef
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    var clubs = JSON.parse(this.responseText);
    var tableBody = document.getElementById("table-body");

    // Clear existing table rows
    tableBody.innerHTML = "";

    // Populate table with club data
    clubs.forEach(function (club) {
      var row = document.createElement("tr");
      row.innerHTML = `
        <td>${club.Club_ID}</td>
        <td>${club.Club_Name}</td>
        <td>${club.Club_Category}</td>
        <td>${club.Club_Link}</td>
        <td class="no-border">
          <i class="fa fa-bars" aria-hidden="true"></i>
          <div id="management-menu">
            <div class="menu-box" menu-box-${club.Club_ID}>
              <button type="button" id="delete-club-${club.Club_ID}">Delete Club</button>
            </div>
          </div>
        </td>
      `;
      tableBody.appendChild(row);

      // Add event listener to the Delete Club button
      var deleteClubButton = document.getElementById(`delete-club-${club.Club_ID}`);
      deleteClubButton.addEventListener("click", function () {
        // Create a confirmation dialog to confirm the club deletion
        var confirmed = confirm(`Are you sure you want to delete club ${club.Club_ID}?`);
        if (confirmed) {
          // Create a new XMLHttpRequest
          var xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                // Club deleted successfully
                // Remove the row from the table
                var tableRow = deleteClubButton.closest("tr");
                tableRow.remove();
              } else {
                // Handle error
              }
            }
          };

          // Prepare the request
          xhr.open("POST", "/deleteclub", true);
          xhr.setRequestHeader("Content-type", "application/json");

          // Prepare the data to send
          var requestData = {
            clubId: club.Club_ID
          };

          // Send the request
          xhr.send(JSON.stringify(requestData));
        }
      });
    });
  } else if (this.status === 403) {
    // Display a notification to the user
    alert("Access forbidden. You do not have permission to view the clubs.");
    window.location.href = "/main.html";
  }
};

// Retrieve the necessary DOM elements
var searchInput = document.getElementById("search-input");
var tableBody = document.getElementById("table-body");

// Add event listener to the search input
searchInput.addEventListener("input", function () {
  var searchQuery = this.value.toLowerCase();

  // Filter the table rows based on the search query
  var rows = tableBody.getElementsByTagName("tr");
  for (var i = 0; i < rows.length; i++) {
    var rowData = rows[i].textContent.toLowerCase();
    if (rowData.includes(searchQuery)) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
});

xhttp.open("GET", "/manageclubs", true);
xhttp.send();
