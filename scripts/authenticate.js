onAuthStateChanged = function(user) {
  var home = document.getElementById('home');
  var login = document.getElementById("login");
  var userPic = document.getElementById('user-pic');
  var userPic1 = document.getElementById('user-pic1');
  var signOut = document.getElementById('sign-out');
  document.getElementById('msg_mi').className = "active"
  if (user) {
    login.hidden = true;
    signOut.hidden = false;
    var profilePicUrl = user.photoURL; 
    currentUser = user;
    // userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    userPic.src = profilePicUrl;
    userPic1.src = profilePicUrl;
    var id = sessionStorage.getItem('chat_id'); 
    if(id != null) {
      loadUsers().then(function(){
        displayUserList();
        loadMessages().then(function(){chat(id)}).catch(function(error){
          console.log("some error - " + error);
        });
      }).catch(function(error){
        console.log("some error - " + error);
      });
    } else {
      loadUsers().then(function(){
        if(this.newUser){
          this.addCurrentUser();
        }
        updateUrl(profilePicUrl);
        this.saveMessagingDeviceToken();
        displayUserList();
        loadMessages().then(function(){
        displayMessages()
        }).catch(function(error){
            console.log("some error - " + error);
            });
    }).catch(function(error){
        console.log("some error - " + error);
      });  
  }
    home.hidden = false;
    // We save the Firebase Messaging Device token and enable notifications.
    
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







