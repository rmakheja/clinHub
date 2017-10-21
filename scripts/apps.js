
AppsClass =class{
  constructor(key, object){
    this.key = object[key]
    this.name = object["name"]
    this.description = object["description"]
    this.icon = object["icon_url"]
    this.onclick   = object["onclick"]
  }
}
loadApps = function(){
  appsRef = firebase.database().ref('Apps/');
    return new Promise(function(res, rej){
        appsRef.on("value", function(snapshot) {
        var apps = snapshot.val();
          for (var appId in apps)
          {
             if(apps.hasOwnProperty(appId)){
               var app = new AppsClass(appId, apps[appId]); 
               appList.push(app);
              }
          }
        res();
        }, function (error) {
          console.log("Error: " + error.code);
          rej(error);
      });
    });
    
};



displayApps = function(){

var appContent = document.getElementById('appContent');
  if(appContent == null)
      return;
  appContent.innerHTML = '';
  
var app_count = appList.length;

var noOfrows = (app_count)/4;
var content = ''
var index = 0;
for (i = 0;i < noOfrows; i++) {
  names = []
  content += '<tr class= "item">'
    for(j = 0; j < 4 && index < app_count; j++) {
        
          var app = appList[index]
          content +='<td class="media" onclick="'+ app.onclick +'">'+
                '<div class="media-left">'+
                  '<a target="_blank" class="pull-left" href="'+ app.onclick +'">'+
                    '<img class="media-object img-circle " style="max-height:100px;" src="'+ app.icon+'"></a>'+
                 '</div>'+
                '<div class="media-body">'+
                    '<h6 class="media-heading"><a target="_blank" href="'+ app.onclick +'">'+app.name +'</a></h6>'+
                    '<p>'+ app.description +'</p>'+ 
              '</div></div></td>';
              index += 1;
          
      }
    content += '</tr>';
  }
  appContent.innerHTML = content;

};

onAuthStateChanged = function(user) {
  var home = document.getElementById('home');
  var login = document.getElementById("login");
  var userPic = document.getElementById('user-pic');
  var userPic1 = document.getElementById('user-pic1');
  var signOut = document.getElementById('sign-out');
  document.getElementById('app_mi').className = "active"
  if (user) { 
    login.hidden = true;
    signOut.hidden = false;
    var profilePicUrl = user.photoURL; 
    currentUser = user;
    // userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    userPic.src = profilePicUrl;
    userPic1.src = profilePicUrl;
    locationList = [];
    loadApps().then(function(){
      displayApps();
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
