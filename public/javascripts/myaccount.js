/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// Make an AJAX request to fetch the user's account details and update the HTML template
var accountXhr = new XMLHttpRequest();
accountXhr.open('GET', '/userdetails', true);
accountXhr.onreadystatechange = function() {
  if (accountXhr.readyState === XMLHttpRequest.DONE) {
    if (accountXhr.status === 200) {
      // Parse the response JSON data
      var data = JSON.parse(accountXhr.responseText);

      // Access the account details from the response
      var givenName = data.User_FirstName;
      var familyName = data.User_LastName;
      var userPFP = data.User_PFP;
      var userEmail = data.User_Email;
      var userHP = data.User_PhoneNumber;

      // Update the HTML template with the account details
      document.getElementById('given-name').textContent = givenName;
      document.getElementById('family-name').textContent = familyName;
      var profilePicElement = document.getElementsByClassName('profile-pic')[0];
      profilePicElement.src = userPFP;
      document.getElementById('currentEmail').textContent = 'Email: ' + userEmail;
      document.getElementById("currentHp").textContent = "HP: " + ("0" + userHP).slice(-10);
    }
  }
};

// Send the AJAX request for account details
accountXhr.send();

var clubXhr = new XMLHttpRequest();
clubXhr.open('GET', '/userclubs', true);
clubXhr.onload = function() {
  if (clubXhr.status === 200) {
    const clubs = JSON.parse(clubXhr.responseText);
    const clubList = document.getElementById('club-list');

    // Iterate over the club data and generate the HTML
    clubs.forEach(function(club) {
      const clubItem = document.createElement('li');
      const clubLink = document.createElement('a');
      clubLink.href = club.Club_Link;
      clubLink.textContent = club.Club_Name;

      const menuButton = document.createElement('button');
      menuButton.type = 'button';
      menuButton.id = 'menu-icon';

      const menuIcon = document.createElement('i');
      menuIcon.classList.add('fa', 'fa-bars');
      menuIcon.setAttribute('aria-hidden', 'true');

      const menuList = document.createElement('ul');
      menuList.style.display = 'none';

      const leaveClubItem = document.createElement('li');
      leaveClubItem.textContent = 'Leave Club';

      leaveClubItem.style.fontSize = '15px';
      leaveClubItem.style.padding = '5px';
      leaveClubItem.style.cursor = 'pointer';

      leaveClubItem.addEventListener('click', function() {
        const clubId = club.Club_ID.toString(); // Convert club ID to a string explicitly

        // Ask for confirmation before leaving the club
        // eslint-disable-next-line no-restricted-globals, no-alert
        const confirmLeave = confirm('Are you sure you want to leave the club?');
        if (!confirmLeave) {
          return; // Abort leaving the club
        }

        var leaveClubXhr = new XMLHttpRequest();
        leaveClubXhr.open('POST', '/leaveclub', true);
        leaveClubXhr.setRequestHeader('Content-Type', 'application/json');

        leaveClubXhr.onload = function() {
          if (leaveClubXhr.status === 200) {
            // Club left successfully, update the UI
            clubItem.remove(); // Remove the club item from the list
          } else {
            // Handle error case
            console.error('Failed to leave club');
          }
        };

        leaveClubXhr.onerror = function() {
          // Handle error case
          console.error('Failed to leave club');
        };

        const requestBody = JSON.stringify({ clubId: clubId });
        leaveClubXhr.send(requestBody);
      });



      menuList.appendChild(leaveClubItem);

      menuButton.appendChild(menuIcon);
      clubItem.appendChild(clubLink);
      clubItem.appendChild(menuButton);
      clubItem.appendChild(menuList);

      // Apply CSS styles for spacing
      clubLink.style.marginRight = '10px';

      // Toggle menu list display when menu button is clicked
      menuButton.addEventListener('click', function() {
        menuList.style.display = menuList.style.display === 'none' ? 'block' : 'none';
      });

      clubList.appendChild(clubItem);
    });

  }
};

// Send the AJAX request for club data
clubXhr.send();

function showPresetImages() {
  const presetImages = document.getElementById('preset-images');
  presetImages.style.display = 'block';
}

function selectPresetImage(imageSrc) {
  const profilePic = document.getElementById('profile-pic');
  profilePic.src = imageSrc;

  // Hide the preset images
  const presetImages = document.getElementById('preset-images');
  presetImages.style.display = 'none';

  // Create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Prepare the request
  xhr.open('POST', '/update-profile-picture', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  // Prepare the data to send in the request body
  const data = {
    profilePictureSrc: imageSrc
  };

  // Convert the data to JSON string
  const jsonData = JSON.stringify(data);

  // Send the request with the JSON data
  xhr.send(jsonData);
}


// Handle the save email button click
function validateEmail(email) {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}

function validateHP(hp) {
  const hpRegex = /^0?[0-9]{9}$/;
  return hpRegex.test(hp);
}

function displayError(elementId, showError) {
  const element = document.getElementById(elementId);
  if (element) {
    if (showError) {
      element.style.display = ""; // Remove the display style
    } else {
      element.style.display = "none"; // Apply the display style as none
    }
  }
}


function updateEmail(email) {
  // Create an object with the form data
  const formData = {
    email: email
  };

  // Create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Configure the request
  xhr.open("POST", "/updateemail");
  xhr.setRequestHeader("Content-Type", "application/json");

  // Define the callback function for when the request is complete
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Request succeeded
      const response = JSON.parse(xhr.responseText);
      // Handle the response from the server
      if (response.success) {
        // Update the email value on the screen
        document.getElementById("currentEmail").textContent = 'Email: ' + email;
        window.location.reload();
      } else {
        console.error("Email update failed:", response.error);
      }
    } else {
      // Request failed
      console.error("Error updating email. Status:", xhr.status);
    }
  };

  // Convert the form data to JSON and send the request
  xhr.send(JSON.stringify(formData));
}

function updateHP(hp) {
  // Create an object with the form data
  const formData = {
    hp: hp
  };

  // Create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Configure the request
  xhr.open("POST", "/updatehp");
  xhr.setRequestHeader("Content-Type", "application/json");

  // Define the callback function for when the request is complete
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Request succeeded
      const response = JSON.parse(xhr.responseText);
      // Handle the response from the server
      if (response.success) {
        // Update the HP value on the screen
        document.getElementById("currentHp").textContent = "HP: " + ("0" + hp).slice(-10);
        console.log("HP updated successfully:", response);
        window.location.reload();
      } else {
        console.error("HP update failed:", response.error);
      }
    } else {
      // Request failed
      console.error("Error updating HP. Status:", xhr.status);
    }
  };

  // Convert the form data to JSON and send the request
  xhr.send(JSON.stringify(formData));
}

function handleSaveEmail() {
  // Retrieve the input values
  const newEmail = document.getElementById("emailInput").value;
  const confirmEmail = document.getElementById("confirmEmailInput").value;

  // Perform client-side form validation
  if (newEmail.trim() === '') {
    // Handle empty email field
    displayError("changeEmailCrossIcon", true);
    displayError("changeEmailCheckIcon", false);
    return;
  }

  if (!validateEmail(newEmail)) {
    // Handle invalid email format
    displayError("changeEmailCrossIcon", true);
    displayError("changeEmailCheckIcon", false);
    return;
  }

  if (validateEmail(newEmail)) {
    // Handle valid email format
    displayError("changeEmailCrossIcon", false);
    displayError("changeEmailCheckIcon", true);
  }

  if (newEmail !== confirmEmail) {
    // Handle email confirmation mismatch
    displayError("confirmEmailCrossIcon", true);
    displayError("confirmEmailCheckIcon", false);
    return;
  }

  if (newEmail === confirmEmail) {
    // Handle email confirmation match
    displayError("confirmEmailCrossIcon", false);
    displayError("confirmEmailCheckIcon", true);
  }

  // Update the email
  updateEmail(newEmail);
}

function handleSaveHP() {
  // Retrieve the input values
  const newHP = parseInt(document.getElementById("hpInput").value, 10);
  const confirmHP = parseInt(document.getElementById("confirmHPInput").value, 10);

  // Perform client-side form validation
  if (newHP.toString().trim() === '') {
    // Handle empty HP field
    displayError("changeHPCrossIcon", true);
    displayError("changeHPCheckIcon", false);
    return;
  }

  if (!validateHP(newHP)) {
    // Handle invalid HP format
    displayError("changeHPCrossIcon", true);
    displayError("changeHPCheckIcon", false);
    return;
  }

  if (validateHP(newHP)) {
    // Handle valid HP format
    displayError("changeHPCrossIcon", false);
    displayError("changeHPCheckIcon", true);
  }

  if (newHP !== confirmHP) {
    // Handle HP confirmation mismatch
    displayError("confirmHPCrossIcon", true);
    displayError("confirmHPCheckIcon", false);
    return;
  }

  if (newHP === confirmHP) {
    // Handle HP confirmation match
    displayError("confirmHPCrossIcon", false);
    displayError("confirmHPCheckIcon", true);
  }

  // Update the HP
  updateHP(newHP);
}

// Handle checkbox change
function handleCheckboxChange(checkbox, otherCheckboxId) {
  const otherCheckbox = document.getElementById(otherCheckboxId);
  if (checkbox.checked) {
    otherCheckbox.checked = false;
  }
}

function notificationSettings() {
  const checkbox1 = document.getElementById('n-changes');
  const checkbox2 = document.getElementById('n-changes-x');

  let selectedCheckbox;

  if (checkbox1.checked) {
    // Checkbox 1 is selected
    selectedCheckbox = 'checkbox1';
  } else if (checkbox2.checked) {
    // Checkbox 2 is selected
    selectedCheckbox = 'checkbox2';
  } else {
    // No checkbox is selected
    return; // or handle the case when no checkbox is selected
  }

  // Prepare the data to be sent in the POST request
  const data = {
    selectedCheckbox: selectedCheckbox
  };

  // Create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Configure the request
  xhr.open('POST', '/notificationsettings');
  xhr.setRequestHeader('Content-Type', 'application/json');

  // Handle the response from the server
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log('POST request sent successfully');
    } else {
      console.error('Error sending POST request. Status:', xhr.status);
    }
  };

  // Handle any error that occurred during the request
  xhr.onerror = function() {
    console.error('Error sending POST request');
  };

  // Send the POST request with the selected checkbox in the request body
  xhr.send(JSON.stringify(data));
}


function updatePasswordOnServer(newPassword) {
  // Create an object with the form data
  const formData = {
    password: newPassword
  };

  // Create a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();

  // Configure the request
  xhr.open("POST", "/updatepassword");
  xhr.setRequestHeader("Content-Type", "application/json");

  // Define the callback function for when the request is complete
  xhr.onload = function () {
    if (xhr.status === 200) {
      // Request succeeded
      const response = JSON.parse(xhr.responseText);
      // Handle the response from the server
      if (response.success) {
        // Password updated successfully
        console.log("Password updated successfully:", response);
        window.location.reload();
      } else {
        console.error("Password update failed:", response.error);
      }
    } else {
      // Request failed
      console.error("Error updating password. Status:", xhr.status);
    }
  };

  // Convert the form data to JSON and send the request
  xhr.send(JSON.stringify(formData));
}

// Handle the save password button click
function handleSavePassword() {
  // Retrieve the input values
  const currentPassword = document.getElementById("currentPasswordInput").value;
  const newPassword = document.getElementById("newPasswordInput").value;
  const confirmPassword = document.getElementById("confirmPasswordInput").value;

  if (newPassword.length < 10 || !/\d/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword)) {
    // Handle invalid new password format
    displayError("newPasswordCross", true);
    displayError("newPasswordCheck", false);
    return;
  }

  if (newPassword.length >= 10 && /\d/.test(newPassword) && /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) {
    // Handle valid new password format
    displayError("newPasswordCross", false);
    displayError("newPasswordCheck", true);
  }


  if (newPassword !== confirmPassword) {
    // Handle password confirmation mismatch
    displayError("confirmPasswordCross", true);
    displayError("confirmPasswordCheck", false);
    return;
  }

  if (newPassword === confirmPassword) {
    // Handle password confirmation match
    displayError("confirmPasswordCross", false);
    displayError("confirmPasswordCheck", true);
  }


  // Send an asynchronous request to the server to validate the current password
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/validatepassword");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // Current password matches
        displayError("currentPasswordCross", false);
        displayError("currentPasswordCheck", true);

        // Update the password on the server
        updatePasswordOnServer(newPassword);
      } else {
        // Current password is incorrect
        displayError("currentPasswordCross", true);
        displayError("currentPasswordCheck", false);
      }
    }
  };
  xhr.send(JSON.stringify({ currentPassword }));
}

// Vue component declaration
// eslint-disable-next-line no-undef
var myAccount = new Vue({
  el: '#mainPage',
  data() {
    return {
      showContact: false,
      showNotifications: false,
      showPassword: false
    };
  }
});
