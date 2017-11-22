var newUser = true;
var maxId = 0;


updateUrl = function(url){
  if(url != currentUser.picUrl) {
        // var refToUpdate = firebase.database().ref('users/'+ currentUser.key+'')
        // refToUpdate.update({
        //      "picurl": url
        // });
        console.log("Update pic");
      }
  
}

addCurrentUser = function(){
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
    "role" : " ",
    "degree" : " ",
    "division" : " ",
    "email" : currentUser.email,
    "secondaryphone" : " ",
    "picurl" : currentUser.photoURL
  })
  currentUser  = new Physician(newid, {
    "firstname" : firstname,
    "lastname" :  lastname,
    "department" : " ",
    "cellPhone" : "",
    "role" : " ",
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
  for(var userId in users_db){
      user = users_db[userId];
      ul += '<li id="' + userId + '"class="media item"'+'" onclick="chat(this.id)">'+
          '<div class="media-body">'+
            '<div class="media">'+
             '<a class="pull-left" href="#">'+
               '<img class="media-object img-circle" style="max-height:40px;" src="'+user.picUrl+'" />'+
              '</a>'+
               '<div class="media-body">'+
                  '<h6 style="margin: 10px 0px;">'+ getUserName(user) +'</h6>'+
              // '<small class="text-muted">Active From 3 hours</small>'+
            '</div>'+
          '</div>'+
         '</div>'+
    '</li>'
    
  };
  list.innerHTML = ul;
}

getId = function(){
  return ++this.maxId;
}

getUserName = function(user){
  return user.firstname + ' ' + user.lastname;
}
