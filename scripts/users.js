var newUser = true;
var maxId = 0;
userClass = class{
  constructor(key,object){
    this.key = key
    this.role = object["role"]
    this.firstname = object["firstname"]
    this.lastname =object["lastname"]
    this.degree = object["degree"]
    this.department = object["department"]
    this.division = object["division"]
    this.email = object["email"]
    this.cellphone = object["cellPhone"]
    //this.secondaryphone = object["secondaryPhone"]
    this.secondaryphone = ''
    this.picUrl = object["picurl"]
}
}

loadUsers = function(){
    userRef = firebase.database().ref('users/');
    return new Promise(function(res, rej){
        userRef.on("value", function(snapshot) {
          userList = []
        var users = snapshot.val();
          for (var userId in users)
          {
            id = parseInt(userId);
            if(id > this.maxId)
              this.maxId = id;
             if(users.hasOwnProperty(userId)){
                var user = new userClass(id, users[userId]);
                if(user.email == currentUser.email){
                  this.newUser = false;
                  currentUser = user;
                }
                else
                  userList.push(user);
              }
          }
        res();
        }, function (error) {
          console.log("Error: " + error.code);
          rej(error);
      });
      
    });

};
updateUrl = function(url){
  if(url != currentUser.picUrl) {
        // var refToUpdate = firebase.database().ref('users/'+ currentUser.key+'')
        // refToUpdate.update({
        //      "picurl": url
        // });
        console.log("Update pic");
      }
  
}
addUser = function(){
    this.newUser = false;
    newid = getId();
    var arr = currentUser.displayName.split(' ');
    var firstname = '';
    var lastname = '';
    if( arr.length === 1 ){
        firstname = arr[0];
    } else {
      firstname = arr.slice(0, -1).join(' ');
      lastname = arr.slice(-1).join(' ');
    }
    userRef = firebase.database().ref('users/'+newid)
    userRef.set({
    "firstname" : firstname,
    "lastname" :  lastname,
    "department" : " ",
    "cellPhone" : "",
    "role" :" ",
    "degree" : " ",
    "division" : " ",
    "email" : currentUser.email,
    "secondaryphone" : " ",
    "picurl" : currentUser.photoURL
  })
  currentUser  = new userClass(newid, {
    "firstname" : firstname,
    "lastname" :  lastname,
    "department" : " ",
    "cellPhone" : "",
    "role" :" ",
    "degree" : " ",
    "division" : " ",
    "email" : currentUser.email,
    "secondaryphone" : " ",
    "picurl" : currentUser.photoURL
  }); 
}

displayUserList = function(){
  
  var list = document.getElementById('user_list');
  list.innerHTML = '';
  var ul = '';
  userList.forEach(function(user){
      ul += '<li id="'+user.key+'"class="media item"'+'" onclick="chat(this.id)">'+
          '<div class="media-body">'+
            '<div class="media">'+
             '<a class="pull-left" href="#">'+
               '<img class="media-object img-circle" style="max-height:40px;" src="'+user.picUrl+'" />'+
              '</a>'+
               '<div class="media-body">'+
                  '<h6>'+user.firstname +' '+ user.lastname +'</h6>'+
              // '<small class="text-muted">Active From 3 hours</small>'+
            '</div>'+
          '</div>'+
         '</div>'+
    '</li>'
    
  });
  list.innerHTML = ul;
}

getId = function(){
  return ++this.maxId;
}