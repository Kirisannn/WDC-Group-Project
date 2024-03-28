/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable no-unused-vars */

var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
	if (this.readyState === 4) {
		if (this.status === 200 || this.status === 304) {
			var response = JSON.parse(this.responseText);
			if (response.success) {
				// User logged in successfully

				// redirect to the home page
				window.location.replace('/main.html');

			} else if (response.error === 'Incorrect password') {
				alert('Incorrect password. Please try again.');
			} else {
				alert(response.message);
			}
		} else if (this.status === 404) {
			alert('User not found!'); // User not found in the database
		} else {
			alert('An error occurred. Please try again.'); // Other error occurred
		}
	}
};

// add event listener to the submit button
var loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', function () {
	// get the data from the form
	var email = document.getElementById('userEmail').value;
	var password = document.getElementById('userPassword').value;

	console.log('Email:', email);
	console.log('Password:', password);

	// check if the email and password are empty
	if (email === '' || password === '') {
		alert('Please enter an email and password.');
		return;
	}

	// make a POST request
	xhttp.open('POST', '/login', true);
	xhttp.setRequestHeader('Content-type', 'application/json');

	// prepare form data
	var formData = {
		email: email,
		password: password
	};

	// send request
	xhttp.send(JSON.stringify(formData));
});
