/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-tabs */
var images = ["images/meme.jpg", "images/meme2.jpg", "images/meme3.jpg", "images/meme4.jpg", "images/meme5.jpg", "images/meme6.jpg", "images/meme7.jpg"];

function Meme() {
  var imageNum = Math.floor(Math.random() * images.length);
  document.getElementById('memes').src = images[imageNum];
}

window.vueinst = new Vue({
  el: '#menu',
  data: {
    logged_in: false
  },
  created: function () {
    this.checkLoggedInStatus();
  },
  methods: {
    checkLoggedInStatus: function () {
      var xhttp = new XMLHttpRequest();
      var self = this;

      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          var response = JSON.parse(this.responseText);
          if (response.userId) {
            self.logged_in = true;
          }
          // if (response.success) {
          //   // redirect to the home page
          //   window.location.href = 'main.html';
          // }
        }
      };

      xhttp.open('GET', '/checkSession', true);
      xhttp.send();
    }
  }
});



var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      var userRole = xhr.responseText;
      if (userRole === "admin") {
        // Display the "Manage Users" link
        var manageUsersLink = document.getElementById("manage-users-link");
        manageUsersLink.style.display = "block";
        var manageClubsLink = document.getElementById("manage-clubs-link");
        manageClubsLink.style.display = "block";
      }
    } else {
      // Handle error cases
      console.log("Error retrieving user role. Status:", xhr.status);
    }
  }
};

xhr.open("GET", "/getuserrole", true);
xhr.send();