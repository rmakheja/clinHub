
chat =function(id){
  sessionStorage.removeItem('chat_id');
  var found = false;
  var elem = document.getElementById("chat")
  elem.hidden = false;
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
                '<div class="media-body">'+ 
                '<small class="text-muted">'+msgList[msg].from +':  </small><br/>'+
                '<p>'+msgList[msg].text.replace(/\n/g,"</br>")+'</p>'
                '<br/><hr/></div></li>';
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
            '<p>'+'</p>'
            '<br/><hr/></div></a></div></li>';
    }
    chatHolder.innerHTML=ul;
  }
  elem.scrollTop = elem.scrollHeight;
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

pressEnter = function(e) {
  e = e || window.event;
  var keyCode = e.keyCode || e.which;
  if(keyCode==13 && !e.shiftKey)
        saveMessage(document.getElementById("sendBtn").value);
}

loadChat = function(){
document.getElementById("chatContainer").hidden = false;

};
