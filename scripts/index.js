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
  initHeader();
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

initHeader = function(){
	var div = document.getElementById("bodyHeader")
	var classi=''
	var classir=''
	var classl=''
	var classp=''
	switch(window.location.pathname) {
		case "/index.html":
		case "/": classi ='is_active';break;
		case "/physicians.html": classp ='is_active';break;
		case "/locations.html": classl ='is_active';break;
		case "/issues.html": classir ='is_active';break;
	}
	

	div.innerHTML = '<h3 class="paddingLeft"><i class="fa fa-user-md" style="color:white"></i>  ClinHub</h3>'+
      '<div class="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">'+
        '<div class="mdl-color--orange-500 mdl-layout__header-row mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop" style="width: 100%">'+
          '<a href="index.html" class="mdl-layout__tab '+classi+'">Messages</a>'+
          '<a href="temp.html" class="mdl-layout__tab '+classp+'">Physicians</a>'+
          '<a href="locations.html" class="mdl-layout__tab '+classl+'">Locations</a>'+
          '<a href="issues.html" class="mdl-layout__tab  '+classir+'">Issue Reporting</a>'+
          '<div id="user-container" class="dropdown width-auto background-transparent">'+
            '<button hidden id="user-pic" class = "dropbtn position-absolute">'+
            '</button>'+
              '<div class="dropdown-content">'+
                  '<a href="#">My Profile</a>'+
                  '<a href="#">Update Profile</a>'+
                  '<a href="#" id="sign-out" onclick="signOut()"> Sign-out </a>'+
              '</div></div></div></div>';
}
