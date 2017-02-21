var currentUser = '';
var userList = [];
var userRef = '';
function ClinHub() {
  checkSetup();
  document.getElementById('login').innerHTML = login_template;
  initFirebase();
 loadUsers();  
}

initFirebase = function() {

  auth = firebase.auth();
  database = firebase.database();
  storage = firebase.storage();
  auth.onAuthStateChanged(onAuthStateChanged.bind(this));
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


onAuthStateChanged = function(user) {

  var userPic = document.getElementById('user-pic');
  var userName = document.getElementById('user-name');
  var login = document.getElementById('login');
  var home = document.getElementById('home');
  var signOutButton = document.getElementById('sign-out');

  if (user) {
    var profilePicUrl = user.photoURL; 
    var userName = user.displayName;   
    document.getElementById('login').innerHTML = '';
    currentUser = user;
    userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    userName.textContent = userName;
    userName.hidden = false;
    userPic.hidden = false;
    signOutButton.hidden = false;
    isUserPresent();
    createUserList();
    home.hidden = false;
    
  } else {
    currentUser = '';
    document.getElementById('login').innerHTML = login_template;
    userPic.style.backgroundImage = '';
    userName.textContent = '';
    userName.setAttribute('hidden', 'true');
    userPic.setAttribute('hidden', 'true');
    signOutButton.setAttribute('hidden', 'true');
    home.hidden = true
    
  }
};


checkSignedInWithMessage = function() {
  /* TODO(DEVELOPER): Check if user is signed-in Firebase. */
 if (auth.currentUser) {
    return true;
  }
  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  //signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};
resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

window.onload = function() {
  window.clinhub = new ClinHub();
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


loadUsers = function(){
    userRef = firebase.database().ref('users/');
    userRef.on("value", function(snapshot) {
   var users = snapshot.val();
   for (var userId in users)
   {
     if(users.hasOwnProperty(userId)){
      var user = new userClass(userId,users[userId]["name"],users[userId]["email"],users[userId]["picUrl"]);
       userList.push(user);
       console.log("loaded child");
     }
   }

}, function (error) {
   console.log("Error: " + error.code);
});

};


isUserPresent = function(){
  if(!userList.find(function(user){return user.email == currentUser.email;}))
    {
      userList = [];
      userRef.push({
   name: currentUser.displayName,
   email:currentUser.email,
   picUrl: currentUser.photoURL
});
    }

}
userClass = class{
  constructor(key,name,email,picUrl){
    this.key = key;
    this.name = name;
    this.picUrl = picUrl;
    this.email = email;
  }
}

login_template ='<div class="omb_login">'+
    '<h3 class="omb_authTitle">Login</h3>'+
    '<div class="row omb_row-sm-offset-3 omb_socialButtons">'+
      '<button id="Fsign-in" class="mdl-button mdl-js-button mdl-button--fab" onclick="fsignIn()">'+
        '<i class="fa fa-facebook" style="color:red"></i>'+
      '</button>'+
      '<button id="Tsign-in" class="mdl-button mdl-js-button mdl-button--fab onclick="tsignIn()">'+
        '<i class="fa fa-twitter" style="color:red"></i>'+
      '</button>'+
      '<button id="Gsign-in" class="mdl-button mdl-js-button mdl-button--fab " onclick="gsignIn()">'+
        '<i class="fa fa-google" style="color:red"></i>'+
      '</button>'+
  '</div>'+
'</div>'

function createUserList(){
  var list = document.getElementById('user_list');
  list.innerHTML = '';
  var ul = '';
  userList.forEach(function(user){
    if(user.email != currentUser.email)
      ul += '<li class="media">'+
          '<div class="media-body">'+
            '<div class="media">'+
             '<a class="pull-left" href="#">'+
               '<img class="media-object img-circle" style="max-height:40px;" src="'+user.picUrl+'" />'+
              '</a>'+
               '<div class="media-body" >'+
                  '<h5>'+user.name +'</h5>'+
              '<small class="text-muted">Active From 3 hours</small>'+
            '</div>'+
          '</div>'+
         '</div>'+
    '</li>'
    
  });
  list.innerHTML = ul;
}