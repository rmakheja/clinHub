chat = function(id){
  sessionStorage.removeItem('chat_id');
  var found = false;
  var elem = document.getElementById("chat")
  elem.hidden = false;
  document.getElementById("historyParent").hidden = true;
  userList.forEach(function(user){
    var anotherUser = id; 
    if(user.key == anotherUser)
    {
      document.getElementById("name").innerHTML = user.firstname + ' ' + user.lastname ;
      document.getElementById("pic").src=user.picUrl;
    }
  });
  for(var thread in messageList) {
    if(messageList[thread].anotherUser == id)
      {
        found = true;
        document.getElementById("sendBtn").value = "thread    : " + messageList[thread].key + " "+id;
        var msgList = messageList[thread].messages
        var chatHolder = document.getElementById("chatmsg");
        var ul ='';
        for(var msg in msgList){
          var clr = "teal"
          var frm = "You"
          if(msgList[msg].from != currentUser.firstname + " " + currentUser.lastname){
              clr = "firebrick"
              frm = msgList[msg].from
            }

          ul += '<li class="media" style="color:'+clr+';">'+
                '<div class="media-body">'+ 
                '<small class="text-muted">'+frm +':  </small><br/>'+
                '<p>'+msgList[msg].text.replace(/\n/g,"</br>")+'</p>'
                '<br/><hr/></div></li>';
        }
        chatHolder.innerHTML=ul;
        chatHolder.parentElement.scrollTop = chatHolder.parentElement.scrollHeight;
    };
  }
//new chat
  if(found == false){
    document.getElementById("sendBtn").value = "newThread : "+id;
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
  console.log(id);
  var messageInput = document.getElementById("new_message");
  var type = id.substring(0, 12);
  id = id.substring(12);

  if (messageInput.value) {
    if(type == "newThread : "){
      messageRef.push({
      messages :{
        0:{
          from: currentUser.firstname +" "  + currentUser.lastname,
          to: id,
          text: messageInput.value
        }
      },
      user1: currentUser.key, 
      user2: id
    }).then(function() {
      resetMaterialTextfield(messageInput);
      chat(id)
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
    }
    else {
      var ind = id.indexOf(" ");
      var to_id = id.substring(ind+1);
      var id = id.substring(0,ind)
      var threadRef = messageRef.child(id).child("messages");
      //threadRef.on("child_added",chat)
        threadRef.push({
        from: currentUser.firstname +" "  + currentUser.lastname,
        to: to_id,
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
