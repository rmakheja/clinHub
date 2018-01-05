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
    // userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    userPic.src = profilePicUrl;
    userPic1.src = profilePicUrl;
    loadUsers().then(function(){
      this.saveMessagingDeviceToken();
      updateUrl(profilePicUrl);
      loadData()
    }).catch(function(error){
      console.log("some error - " + error);
    });  
    home.hidden = false;
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
