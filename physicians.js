
PhysicianClass = class{
  //constructor(key,role,firstname,lastname,degree,department,division,email,cellphone,secondaryphone){
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
};
loadPhysicians = function(){
  physicianList = [];
  physicianRef = firebase.database().ref('physicians/');
    return new Promise(function(res, rej){
        physicianRef.on("value", function(snapshot) {
        var physicians = snapshot.val();
          for (var physicianId in physicians)
          {
             if(physicians.hasOwnProperty(physicianId)){
               var physician = new PhysicianClass(physicianId, physicians[physicianId]); 
               physicianList.push(physician);
              }
          }
        res();
        }, function (error) {
          console.log("Error: " + error.code);
          rej(error);
      });
    });  
};

  displayPhysicians = function(){
    
    var list = document.getElementById('physician_list');
    list.innerHTML = '';
    var ul = '';
    physicianList.forEach(function(physician){

      if(physician.email != currentUser.email)
        // ul += '<li id="'+physician.email+'"class="media"'+'" onclick="contact(this.id)">'+
        //     '<div class="media-body">'+
        //       '<div class="media">'+
        //        '<a class="pull-left" href="#">'+
        //          '<img class="media-object img-circle" style="max-height:40px;" src="'+physician.picUrl+'" />'+
        //         '</a>'+
        //          '<div class="media-body">'+
        //             '<h5>'+physician.firstname + ' '+ physician.lastname+' ('+ physician.degree+') </h5>'+
        //          '<small class="text-muted">'+physician.role+', '+ physician.department+'</small></br>'+
        //          '<small class="text-muted"> Division: '+physician.division+'</small></br>'+
        //          '<small class="text-muted"> Email: '+physician.email+'</small></br>'+
        //          '<small class="text-muted"> cellphone: '+physician.cellphone+'</small></br>'+
        //          '<small class="text-muted"> Secondary Phone: '+physician.secondaryphone+'</small></br>'+

        //       '</div>'+
        //     '</div>'+
        //    '</div>'+
        // '</li>';
        // ul += '<tr><td>' + physician.role + '</td>' +
        //       '<td id= "'+ physician.email+ '" onclick="contact(this.id)">'+physician.firstname+'</td>' +
        //       '<td>'+physician.lastname+'</td>' +
        //       '<td>'+physician.degree+'</td>' + 
        //       '<td>'+ physician.department+'</td>' +
        //       '<td>' + physician.division +'</td>'+
        //       '<td>'+physician.email+'</td>' + 
        //       '<td>'+ physician.cellphone+'</td>' +
        //       '<td>' + physician.secondaryphone +'</td></tr>';
        ul += '<tr class="item"><td id= "'+ physician.email+ '" onclick="contact(this.id)">'+physician.firstname+'</td>' +
              '<td>'+physician.lastname+'</td>' +
              '<td>'+ physician.department+'</td>' +
              '<td>'+ physician.cellphone+'</td></tr>';

    });
   list.innerHTML = ul;
  };
  
contact = function(email){
    sessionStorage.setItem('chat_id', email);
    window.location.replace("index.html");
}

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
    physicianList = [];
    loadPhysicians().then(function(){
      displayPhysicians();
      }).catch(function(error){
        console.log("some error - " + error);
      });  
    home.hidden = false;
    
  } else {
    
    messageList = [];
    userList = [];
    physicianList = [];
    locationList = [];
    currentUser = '';
    login.hidden = false;
    home.hidden = true;
    userPic.hidden = true;
  }
};

sortDisplay = function(){
  var param = document.getElementById("sort").value;
  physicianList.sort(function(a,b) {return a[param] > b[param] ? 1 : ((b[param] > a[param]) ? -1 : 0);} );
  displayPhysicians(); 
}
