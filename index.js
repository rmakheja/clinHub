var currentUser = '';
var userList = [];
var userRef = '';
var messageRef = '';
var messageList = [];
var currid = '';
function ClinHub() {
  checkSetup();
  document.getElementById('login').innerHTML = login_template;
  initFirebase();
 
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
    messageList = [];
    userList = [];
    loadUsers().then(function(){
      isUserPresent();
      createUserList();
      loadMessages().then(function(){
        displayMessages()
        }).catch(function(error){
            console.log("some error - " + error);
            });
    }).catch(function(error){
        console.log("some error - " + error);
      });  
    home.hidden = false;
    
  } else {
    messageList = [];
    userList = [];
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
  //element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
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
      console.log(currentUser);
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

loadMessages = function(){
    messageRef = firebase.database().ref('messageThreads/');
   return new Promise(function(res, rej){
       messageRef.on("value", function(snapshot) {
          var threads = snapshot.val();
          console.log(threads);
          messageList = [];
          for (var threadId in threads)
          {
            if(threads.hasOwnProperty(threadId)){
              var user1 = threads[threadId]["user1"]
              var user2 = threads[threadId]["user2"]
              var msgList = [];
                var messages = threads[threadId]["messages"];
                for(var msg in messages)
                {
                    var msgObject = new messageClass(msg,messages[msg].from,messages[msg].text);
                    msgList.push(msgObject);
                }
                
              if(user1 == currentUser.email)
              {
                var thread = new messageThreadClass(threadId,msgList,user2);
                messageList.push(thread);
              }
              else if(user2 == currentUser.email) {
                var thread = new messageThreadClass(threadId,msgList,user1);
                messageList.push(thread);
              }
            }
         }
         res();
          }, function (error) {
          console.log("Error: " + error.code);
          rej(error);
        }); 
   })
   

};
messageThreadClass = class{
  constructor(key,messages,anotherUser){
    this.key = key;
    this.anotherUser = anotherUser
    this.messages = messages;
  }
};
messageClass = class{
  constructor(key,from,text){
    this.key = key
    this.from = from
    this.text = text
  }
}
displayMessages = function(){
  var msgDiv = document.getElementById("history");
  msgDiv.innerHTML='';
  var ul ='';
  for(var thread in messageList) {
    userList.forEach(function(data){
      if(data.email == messageList[thread].anotherUser)
        {
          ul +=  '<li class="media" id = "'+messageList[thread].anotherUser+'"onclick="chat(this.id)">'+
              '<div class="media-body media">'+
              '<a class="pull-left" href="#">'+
              '<img class="media-object img-circle " style="max-height:40px;" src="'+ data.picUrl+'" />'+
              '<div class="media-body" >'+ messageList[thread].messages[0].text+
              '<br />'+
              '<small class="text-muted">'+data.name +' </small>'+
              '<hr /></div></a></div></li>';
          
        }    
    })

    };
    msgDiv.innerHTML= msgDiv.innerHTML + ul;
};

chat =function(id){
  console.log(id);
  if(id)
      currid = id;

  var found = false;
  document.getElementById("chat").hidden = false;
  document.getElementById("historyParent").hidden = true;
  userList.forEach(function(data){
    var anotherUser = id; 
    if(data.email == anotherUser)
    {
      document.getElementById("name").innerHTML = data.name;
      document.getElementById("pic").src=data.picUrl;
    }
  });
        
  for(var thread in messageList) {
    if(messageList[thread].anotherUser == id)
      {
        found = true;
        document.getElementById("sendBtn").value = "thread: " + messageList[thread].key;
        var msgList = messageList[thread].messages
        var chatHolder = document.getElementById("chatmsg");
        var ul ='';
        for(var msg in msgList){
          ul += '<li class="media">'+
                '<div class="media-body media">'+            
                '<div class="media-body" >'+
                '<small class="text-muted">'+msgList[msg].from +':  </small><br/>'+
                '<div>'+msgList[msg].text+'</div>'
                '<br/><hr/></div></a></div></li>';
        }
        chatHolder.innerHTML=ul;
    };
  }
//new chat
  if(found == false){
    document.getElementById("sendBtn").value = "email : "+id;
    var msgList = "";
    var chatHolder = document.getElementById("chatmsg");
    var ul ='';
    for(var msg in msgList){
      ul += '<li class="media">'+
            '<div class="media-body media">'+    
            '<div class="media-body" >'+
            '<small class="text-muted">'+':  </small><br/>'+
            '<div>'+'</div>'
            '<br/><hr/></div></a></div></li>';
    }
    chatHolder.innerHTML=ul;
  }
}

saveMessage = function(id){
  //this.preventDefault();
  // Check that the user entered a message and is signed in.
  var messageInput = document.getElementById("new_message");
  var type = id.substring(0, 8);
  id = id.substring(8);
  if (messageInput.value) {
    if(type == "email : "){
      messageRef.push({
      messages :{
        0:{
          from: currentUser.displayName,
          text: messageInput.value
        }
      },
      user1: currentUser.email, 
      user2: id
    }).then(function() {
      resetMaterialTextfield(messageInput);
      chat(id)
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
    }
    else {
    var threadRef = messageRef.child(id).child("messages");
    //threadRef.on("child_added",chat)
      threadRef.push({
      from: currentUser.displayName,
      text: messageInput.value
      
    }).then(function() {
      resetMaterialTextfield(messageInput);
      messageList.forEach(function(data){
        if(data.key == id){
          chat(data.anotherUser);
        }
      })
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  }
}

}
