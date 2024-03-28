/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable no-unused-vars */

// eslint-disable-next-line no-undef
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
        if (this.status === 200 || this.status === 304) {
            var response = JSON.parse(this.responseText);
            if (response.success) {
                var confirmMessage = "Account created successfully. Please login to continue.";
                if (confirm(confirmMessage)) {
                    window.location.replace('/login.html');
                }
            } else {
                alert(response.message);
            }
        } else {
            alert("An error occurred. Please try again."); // Other error occurred
        }
    }
};



// add eventlistener to the submit button
var submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", function () {

    // get the data from the form
    var firstName = document.getElementById("first-name").value;
    var lastName = document.getElementById("last-name").value;
    var mnumber = document.getElementById("mobile-number").value;
    var email = document.getElementById("email").value;
    var confirmEmail = document.getElementById("confirm-email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;

    // check if some fields are empty, give alert required fields
    if (firstName === "" || lastName === "" || mnumber === "" || email === "" || confirmEmail === "" || password === "" || confirmPassword === "") {
        alert("All fields are required");
        return;
    }

    // check if user enter valid phone number (if phone contains alphabet it is invalid)
    if (isNaN(mnumber)) {
        alert("Invalid phone number");
        return;
    }

    // check if user enter valid email address
    if (!email.includes("@") || !email.includes(".")) {
        alert("Invalid email address");
        return;
    }

    // check if the email and confirm email are the same
    if (email !== confirmEmail) {
        alert("Emails do not match");
        return;
    }

    // check if the password and confirm password are the same
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // check if the password is at least 10 characters long
    if (password.length < 10) {
        alert("Password must be at least 10 characters long");
        return;
    }

    // check if the password contains at least 1 number
    if (!/\d/.test(password)) {
        alert("Password must contain at least 1 number");
        return;
    }

    // check if the password contains at least 1 uppercase letter
    if (!/[A-Z]/.test(password)) {
        alert("Password must contain at least 1 uppercase letter");
        return;
    }

    // check if the password contains at least 1 lowercase letter
    if (!/[a-z]/.test(password)) {
        alert("Password must contain at least 1 lowercase letter");
        return;
    }

    // prepare and send the request
    xhttp.open('POST', '/signup', true);
    xhttp.setRequestHeader('Content-type', 'application/json');

    // prepare the data
    var requestData = {
        firstName: firstName,
        lastName: lastName,
        mnumber: mnumber,
        email: email,
        password: password
    };

    // send the request
    xhttp.send(JSON.stringify(requestData));

});


