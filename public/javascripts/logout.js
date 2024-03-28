/* eslint-disable no-restricted-globals */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable no-unused-vars */

var xhttp = new XMLHttpRequest();

// implement a log out function
xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
        if (this.status === 200 || this.status === 304) {
            var response = JSON.parse(this.responseText);
            if (response.success) {
                // User logged out successfully
                window.location.reload(); // Reload the current page
            } else {
                alert(response.message);
            }
        } else {
            alert("An error occurred. Please try again."); // Other error occurred
        }
    }
};

function logout() {
    // make a POST request
    xhttp.open("POST", "/logout", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // send request
    xhttp.send();
}


