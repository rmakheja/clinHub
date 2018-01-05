var currentUser = '';
var currUserkey = -1;
var userRef = '';
var messageRef = '';
var currid = '';
var chat_id = '';
var maxId = 0;
window.onload = function() {
  checkSetup();
  initFirebase();
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
  this.deleteMessagingToken()
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
                                                '<a href="/" id="msg_mi">Messages</a>'+
                                                '<a href="users.html" id="usr_mi">Users</a>'+
                                                '<a href="locations.html" id="loc_mi">Locations</a>'+
                                                // '<a href="issues.html" id="iss_mi">Issues</a>'+
                                                '<a href="storage.html" id="rsr_mi">Resources</a>'+
                                                '<a href="apps.html" id="app_mi">Apps</a>'+
                                                '<a href="schedule.html" id="sch_mi">Schedules</a>'+
                                                '<a href="surveys.html" id="sur_mi">Surveys</a>'+
                                                '<a href="#" id="sign-out" onclick="signOut()">Sign Out</a>'+
                                                '<a href="#MyProfile;" style="font-size:15px;" id="iconLarge" class="icon" onclick="myFunction()"> <img src="" id="user-pic"></a>'+
                                                '<a href="javascript:void(0);" style="font-size:15px;" id="iconSmall" class="icon" onclick="myFunction()"> <img src="" id="user-pic1"></a><!-- &#9776;</a> -->'+
                                              '</div>'
document.getElementById("login").innerHTML = '<h3> Welcome to Clinhub! <h3>'+
  '<h3>Please click the button below to login using gmail<h3>'+
  '<button id="Gsign-in" class="mdl-button mdl-js-button mdl-button--fab " onclick="gsignIn()">'+
    '<i class="fa fa-google" style="color:red"></i>'+
  '</button>'+
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
})

onAuthStateChanged = function(user) {
  var home = document.getElementById('home');
  var login = document.getElementById("login");
  var userPic = document.getElementById('user-pic');
  var userPic1 = document.getElementById('user-pic1');
  var signOut = document.getElementById('sign-out');
  if (user) {
    currentUser = user
    loadUsers().then(function(){
      if(currentUser != user){
        
        login.hidden = true;
        signOut.hidden = false;
        var profilePicUrl = user.photoURL; 
        // userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
        userPic.src = profilePicUrl;
        userPic1.src = profilePicUrl;
        this.saveMessagingDeviceToken();
        updateUrl(profilePicUrl);
        loadData()
        home.hidden = false;
      } else{
        auth.signOut();
        alert("You are not authorised to sign in. Please contact Stony Brook University Hospital - Anesthesiology Department.")
      }
    }).catch(function(error){
      console.log("some error - " + error);
    });  
  } else {
    unLoadDb()
    currentUser = '';
    login.hidden = false;
    home.hidden = true;
    signOut.hidden = true;
    userPic.src= "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";
    userPic1.src= "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg;"
  }

    
      
};

updateUrl = function(url){
  if(url != currentUser.picUrl) {
    var refToUpdate = firebase.database().ref('users/'+ currentUser.key+'/')
    refToUpdate.update({
         "picurl": url
    });
  }
}


getUserName = function(user){
  if(user != null)
    return user.firstname + ' ' + user.lastname;
  else
    return " "
}

getFullName = function(user){
  if(user != null)
    return user.lastname + ' ' + user.firstname;
  else
    return " "
}

deleteMessagingToken = function(){
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      // Saving the Device Token to the datastore.
      refToDelete = firebase.database().ref('/fcmTokens/' + currentToken + '/')
      refToDelete.remove();
      auth.signOut();
    }
  }.bind(this)).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
}