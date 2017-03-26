var currentUser = '';
var userList = [];
var physicianList = [];
var locationList = [];
var userRef = '';
var messageRef = '';
var messageList = [];
var currid = '';
var chat_id = '';

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
   auth.signOut();
};
