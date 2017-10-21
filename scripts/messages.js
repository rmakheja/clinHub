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
loadMessages = function(){
    messageRef = firebase.database().ref('messageThreads/');
   return new Promise(function(res, rej){
       messageRef.on("value", function(snapshot) {
          var threads = snapshot.val();
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
                
              if(user1 == currentUser.key)
              {
                var thread = new messageThreadClass(threadId,msgList,user2);
                messageList.push(thread);
              }
              else if(user2 == currentUser.key) {
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

displayMessages = function(){
  document.getElementById("chat").hidden = true;
  document.getElementById("historyParent").hidden = false;
  var msgDiv = document.getElementById("history");
  
  msgDiv.innerHTML='';
  var ul ='';
  for(var thread in messageList) {
    userList.forEach(function(user){
      if(user.key == messageList[thread].anotherUser)
        {
          ul +='<li class="media" id = "'+messageList[thread].anotherUser+'"onclick="chat(this.id)">'+
                '<div class="media-left">'+
                  '<a class="pull-left" href="#">'+
                    '<img class="media-object img-circle " style="max-height:50px;" src="'+ user.picUrl+'"></a>'+
                 '</div>'+
                '<div class="media-body">'+
                    '<h6 class="media-heading" >'+user.firstname + ' ' + user.lastname +'</h6>'+
                    '<p>'+messageList[thread].messages[messageList[thread].messages.length - 1].text +'</p>'+ 
              //'<br />'+
              //'<small class="text-muted">'+data.name +' </small>'+
              '</div></div></li>';
          
        }    

        
              
    })

    };
    msgDiv.innerHTML= msgDiv.innerHTML + ul;
};
