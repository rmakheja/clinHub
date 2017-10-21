LocationClass =class{
  constructor(key, object){
    this.key = object[key]
    this.name = object["name"]
    this.cellphone = object["cellPhone"]
  }
}
loadLocations = function(){
  locationsRef = firebase.database().ref('locations/');
    return new Promise(function(res, rej){
        locationsRef.on("value", function(snapshot) {
        var locations = snapshot.val();
          for (var locationId in locations)
          {
             if(locations.hasOwnProperty(locationId)){
               var location = new LocationClass(locationId, locations[locationId]); 
               locationList.push(location);
              }
          }
        res();
        }, function (error) {
          console.log("Error: " + error.code);
          rej(error);
      });
    });
    
};

displayLocations = function(){
  var list = document.getElementById('location_list');
  if(list == null)
      return;
  list.innerHTML = '';
  var ul = '';
  locationList.forEach(function(location){
      // ul += '<li class="media">'+
      //         '<div class="media-body">'+
      //             '<h5>'+ location.name+' : '+ location.cellphone+'</h5>'+
      //         '</div>'+
      //     '</li>'
      ul += '<tr class="item"><td>' + location.name + '</td><td>' + location.cellphone + '</td></tr>'
  });
  list.innerHTML = ul;
};

onAuthStateChanged = function(user) {
  var home = document.getElementById('home');
  var login = document.getElementById("login");
  var userPic = document.getElementById('user-pic');
  var userPic1 = document.getElementById('user-pic1');
  var signOut = document.getElementById('sign-out');
  document.getElementById('loc_mi').className = "active"
  if (user) { 
    login.hidden = true;
    signOut.hidden = false;
    var profilePicUrl = user.photoURL; 
    currentUser = user;
    // userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    userPic.src = profilePicUrl;
    userPic1.src = profilePicUrl;
    locationList = [];
    loadLocations().then(function(){
      displayLocations();
      }).catch(function(error){
        console.log("some error - " + error);
      });  
    home.hidden = false;
    
  } else {
    
    messageList = [];
    userList = [];
    physicianList = [];
    locationList = [];
    appList = [];
    currentUser = '';
    login.hidden = false;
    home.hidden = true;
    signOut.hidden = true;
    userPic.src= "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";
    userPic1.src= "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg;"
  }
};
