userClass = class{
  constructor(key,name,email,picUrl){
    this.key = key;
    this.name = name;
    this.picUrl = picUrl;
    this.email = email;
  }
}

loadUsers = function(){

    userRef = firebase.database().ref('users/');
    console.log(userRef);
    return new Promise(function(res, rej){
        userRef.on("value", function(snapshot) {
        var users = snapshot.val();
        console.log("here"+users);
          for (var userId in users)
          {
             if(users.hasOwnProperty(userId)){
                var user = new userClass(userId,users[userId]["name"],users[userId]["email"],users[userId]["picUrl"]);
                userList.push(user);
                console.log("loaded child");
              }
          }
        res();
        }, function (error) {
          console.log("Error: " + error.code);
          rej(error);
      });
    });
    
};


isUserPresent = function(){
  if(userList.find(function(user){return user.email == currentUser.email}) == undefined)
    {
      
      userList = [];
      userRef.push({
        name: currentUser.displayName,
        email:currentUser.email,
        picUrl: currentUser.photoURL
      });
  }

}

displayUserList = function(){
  var list = document.getElementById('user_list');
  list.innerHTML = '';
  var ul = '';
  userList.forEach(function(user){
    if(user.email != currentUser.email)
      ul += '<li id="'+user.email+'"class="media"'+'" onclick="chat(this.id)">'+
          '<div class="media-body">'+
            '<div class="media">'+
             '<a class="pull-left" href="#">'+
               '<img class="media-object img-circle" style="max-height:40px;" src="'+user.picUrl+'" />'+
              '</a>'+
               '<div class="media-body">'+
                  '<h5>'+user.name +'</h5>'+
              // '<small class="text-muted">Active From 3 hours</small>'+
            '</div>'+
          '</div>'+
         '</div>'+
    '</li>'
    
  });
  list.innerHTML = ul;
}

