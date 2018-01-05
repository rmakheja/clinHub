loadData = function(){
  document.getElementById('msg_mi').className = "active"
  displayUserList();
  loadMessages().then(function(){
    var id = sessionStorage.getItem('chat_id')
    if(id != null)
      chat(id)
    else
      displayMessages()
  }).catch(function(error){
    console.log("some error - " + error);
  });
}
checkSignedInWithMessage = function() {
 if (auth.currentUser) {
    return true;
  }
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  return false;
};
resetMaterialTextfield = function(element) {
  element.value = '';
  //element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

displayMessages = function(){
  document.getElementById("chat").hidden = true;
  document.getElementById("historyParent").hidden = false;
  var msgDiv = document.getElementById("history");
  
  msgDiv.innerHTML='';
  var ul ='';

  for(var toId in messages_db) {
    if(toId in users_db) {
      toUser = users_db[toId]
      msgList = messages_db[toId].messages
      var last = (last=Object.keys(msgList))[last.length-1];

      var clr = "teal"

      if(msgList[last].from != getUserName(currentUser)){
        clr = "firebrick"
      }

      ul += '<li class="media" id = "'+toId+'"onclick="chat(this.id)">'+
            '<div class="media-left">'+
            '<a class="pull-left" href="#">'+
            '<img class="media-object img-circle " style="max-height:50px;" src="'+ toUser.picUrl+'"></a>'+
            '</div>'+
            '<div class="media-body">'+
            '<h6 class="media-heading" >'+ getFullName(toUser) +'</h6>'+
            '<p style="color:' + clr + ';">'+msgList[last].text +'</p>'+ 
            //'<br />'+
            //'<small class="text-muted">'+data.name +' </small>'+
            '</div></div></li>';
    }
  }
  msgDiv.innerHTML= msgDiv.innerHTML + ul;
};
