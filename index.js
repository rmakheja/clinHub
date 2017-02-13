
function ClinHub() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.fsignInButton = document.getElementById('Fsign-in');
  this.tsignInButton = document.getElementById('Gsign-in');
  this.gsignInButton = document.getElementById('Tsign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.login = document.getElementById('login');
  this.home = document.getElementById('home');
  // Saves message on form submit.
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.fsignInButton.addEventListener('click', this.fsignIn.bind(this));
  this.gsignInButton.addEventListener('click', this.gsignIn.bind(this));
  this.tsignInButton.addEventListener('click', this.tsignIn.bind(this));
  this.initFirebase();
}
// Sets up shortcuts to Firebase features and initiate firebase auth.
ClinHub.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

ClinHub.prototype.fsignIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};
ClinHub.prototype.tsignIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};
ClinHub.prototype.gsignIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};


// Signs-out of Friendly Chat.
ClinHub.prototype.signOut = function() {
  // TODO(DEVELOPER): Sign out of Firebase.
   this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
ClinHub.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    var profilePicUrl = user.photoURL; // Only change these two lines!
    var userName = user.displayName;   // Only change these two lines!
    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');
    login.hidden=true
    window.location = "chat.html";
    this.home.hidden = false;
    this.home.textContent = "Welcome   " + this.userName.textContent
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');
    this.home.hidden = true
    login.hidden = false;
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
ClinHub.prototype.checkSignedInWithMessage = function() {
  /* TODO(DEVELOPER): Check if user is signed-in Firebase. */
 if (this.auth.currentUser) {
    return true;
  }
  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  //this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};
ClinHub.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

window.onload = function() {
  window.clinhub = new ClinHub();
};

ClinHub.prototype.checkSetup = function() {
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
