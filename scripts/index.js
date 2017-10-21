var currentUser = '';
var currUserkey = -1;
var userList = [];
// var physicianList = [];
var locationList = [];
var appList = [];
var userRef = '';
var messageRef = '';
var messageList = [];
var currid = '';
var chat_id = '';
var foldersList = [];
var filesList = [];

window.onload = function() {
  checkSetup();
  initFirebase();
  // initHeader();
};

initFirebase = function() {
  auth = firebase.auth();
  database = firebase.database();
  storage = firebase.storage();
  auth.onAuthStateChanged(onAuthStateChanged.bind(this));
};

checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions.');
  } else if (config.storageBucket === '') {
    window.alert('Your Firebase Storage bucket has not been enabled. Sorry about that. This is ' +
        'actually a Firebase bug that occurs rarely. ' +
        'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
        'and make sure the storageBucket attribute is not empty. ' +
        'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
        'displayed there.');
  }
};
fsignIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};
tsignIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};
gsignIn = function() {
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

signOut = function() {
   auth.signOut();
};

function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

document.getElementById("header").innerHTML = '<h3><i class="fa fa-user-md" style="color:white"></i>  ClinHub</h3>'+
                                                '<div class="topnav" id="myTopnav">'+
                                                '<a href="index.html" id="msg_mi">Messages</a>'+
                                                '<a href="users.html" id="usr_mi">Users</a>'+
                                                '<a href="locations.html" id="loc_mi">Locations</a>'+
                                                '<a href="issues.html" id="iss_mi">Issues</a>'+
                                                '<a href="storage.html" id="rsr_mi">Resources</a>'+
                                                '<a href="apps.html" id="app_mi">Apps</a>'+
                                                '<a href="#" id="sign-out" onclick="signOut()">Sign Out</a>'+
                                                '<a href="#MyProfile;" style="font-size:15px;" id="iconLarge" class="icon" onclick="myFunction()"> <img src="" id="user-pic"></a>'+
                                                '<a href="javascript:void(0);" style="font-size:15px;" id="iconSmall" class="icon" onclick="myFunction()"> <img src="" id="user-pic1"></a><!-- &#9776;</a> -->'+
                                              '</div>'
// Saves the messaging device token to the datastore.
saveMessagingDeviceToken = function() {

  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      // Saving the Device Token to the datastore.
      firebase.database().ref('/fcmTokens').child(currentToken)
          .set(this.currentUser.key);
    } else {
      // Need to request permissions to show notifications.
      this.requestNotificationsPermissions();
    }
  }.bind(this)).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
}

// Requests permissions to show notifications.
requestNotificationsPermissions = function() {
  firebase.messaging().requestPermission().then(function() {
    // Notification permission granted.
    this.saveMessagingDeviceToken();
  }.bind(this)).catch(function(error) {
    console.error('Unable to get permission to notify.', error);
  });
};
messaging = firebase.messaging();
messaging.onMessage(function(payload) {
  console.log("Message received. ", payload);
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if(ios){
      notify(payload);
  }
  })


  var notify = function (payload) {
      // Check for notification compatibility.
      if (!'Notification' in window) {
          // If the browser version is unsupported, remain silent.
          return;
      }
      // Log current permission level
      console.log(Notification.permission);
      // If the user has not been asked to grant or deny notifications
      // from this domain...
      if (Notification.permission === 'default') {
          Notification.requestPermission(function () {
              // ...callback this function once a permission level has been set.
              notify();
          });
      }
    // If the user has granted permission for this domain to send notifications...
    else if (Notification.permission === 'granted') {
        var n = new Notification(payload);
        // Remove the notification from Notification Center when clicked.
        n.onclick = function () {
            this.close();
        };
        // Callback function when the notification is closed.
        n.onclose = function () {
            console.log('Notification closed');
        };
    }
    // If the user does not want notifications to come from this domain...
    else if (Notification.permission === 'denied') {
        // ...remain silent.
        return;
    }
}