chat = function(id){
  sessionStorage.removeItem('chat_id');
  var found = false;
  var elem = document.getElementById("chat")
  elem.hidden = false;
  document.getElementById("historyParent").hidden = true;
  
  var toUser = users_db[id]; 
  document.getElementById("name").innerHTML = getFullName(toUser) ;
  document.getElementById("pic").src=toUser.picUrl;
  
  if(id in messages_db) {
    msgThread = messages_db[id]
    document.getElementById("sendBtn").value = "thread    : " + msgThread.key + " " + id;
    var msgList = msgThread.messages
    var chatHolder = document.getElementById("chatmsg");
    var ul ='';
    for(var msg in msgList){
      var clr = "teal"
      var frm = "You"

      if(msgList[msg].from != getUserName(currentUser)){
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
  } else { // new chat
    document.getElementById("sendBtn").value = "newThread : " + id;
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
    } else {
      var ind = id.indexOf(" ");
      var to_id = id.substring(ind+1);
      var id = id.substring(0,ind)
      var threadRef = messageRef.child(id).child("messages");
      threadRef.push({
        from: getUserName(currentUser),
        to: to_id,
        text: messageInput.value
      }).then(function() {
        resetMaterialTextfield(messageInput);
        chat(to_id)
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
