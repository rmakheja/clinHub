

onAuthStateChanged = function(user) {
  var home = document.getElementById('home');
  var login = document.getElementById("login");
  var userPic = document.getElementById('user-pic');
  if (user) { 
    login.hidden = true;
    userPic.hidden = false;
    var profilePicUrl = user.photoURL; 
    currentUser = user;
    userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    messageList = [];
    userList = [];
    var id = sessionStorage.getItem('chat_id'); 
    if(id != null) {
        loadUsers().then(function(){
          loadMessages().then(function(){chat(id)}).catch(function(error){
            console.log("some error - " + error);
            });
        }).catch(function(error){
            console.log("some error - " + error);
            });
    }
    else {
      loadUsers().then(function(){
      isUserPresent();
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
    
  } else {
    
    messageList = [];
    userList = [];
    currentUser = '';
    login.hidden = false;
    home.hidden = true;
    userPic.hidden = true;
  }
};






