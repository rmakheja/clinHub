displayLocations = function(){
  document.getElementById("chatContainer").hidden = true;
  document.getElementById("Physicians").hidden = true;
  document.getElementById("Locations").hidden = false;
  var list = document.getElementById('location_list');
  list.innerHTML = '';
  var ul = '';
  locationList.forEach(function(location){
      ul += '<li class="media">'+
              '<div class="media-body">'+
                  '<h5>'+ location.name+' : '+ location.cellphone+'</h5>'+
              '</div>'+
          '</li>'
  });
  list.innerHTML = ul;
};
displayUserList = function(){
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
displayMessages = function(){
  document.getElementById("chat").hidden = true;
  document.getElementById("historyParent").hidden = false;
  var msgDiv = document.getElementById("history");
  
  msgDiv.innerHTML='';
  var ul ='';
  for(var thread in messageList) {
    userList.forEach(function(data){
      if(data.email == messageList[thread].anotherUser)
        {
          ul +='<li class="media" id = "'+messageList[thread].anotherUser+'"onclick="chat(this.id)">'+
                '<div class="media-left">'+
                  '<a class="pull-left" href="#">'+
                    '<img class="media-object img-circle " style="max-height:50px;" src="'+ data.picUrl+'"></a>'+
                 '</div>'+
                '<div class="media-body">'+
                    '<h4 class="media-heading" >'+data.name+'</h4>'+
                    '<p>'+messageList[thread].messages[messageList[thread].messages.length - 1].text +'</p>'+ 
              //'<br />'+
              //'<small class="text-muted">'+data.name +' </small>'+
              '</div></div></li>';
          
        }    

        
              
    })

    };
    msgDiv.innerHTML= msgDiv.innerHTML + ul;
};

  displayPhysicians = function(){
    document.getElementById("chatContainer").hidden = true;
    document.getElementById("Physicians").hidden = false;
    document.getElementById("Locations").hidden = true;
    var list = document.getElementById('physician_list');
    list.innerHTML = '';
    var ul = '';
    physicianList.forEach(function(physician){
      
      if(physician.email != currentUser.email)
        ul += '<li id="'+physician.email+'"class="media"'+'" onclick="contact(this.id)">'+
            '<div class="media-body">'+
              '<div class="media">'+
               '<a class="pull-left" href="#">'+
                 '<img class="media-object img-circle" style="max-height:40px;" src="'+physician.picUrl+'" />'+
                '</a>'+
                 '<div class="media-body">'+
                    '<h5>'+physician.firstname + ' '+ physician.lastname+' ('+ physician.degree+') </h5>'+
                 '<small class="text-muted">'+physician.role+', '+ physician.department+'</small></br>'+
                 '<small class="text-muted"> Division: '+physician.division+'</small></br>'+
                 '<small class="text-muted"> Email: '+physician.email+'</small></br>'+
                 '<small class="text-muted"> cellphone: '+physician.cellphone+'</small></br>'+
                 '<small class="text-muted"> Secondary Phone: '+physician.secondaryphone+'</small></br>'+

              '</div>'+
            '</div>'+
           '</div>'+
      '</li>'

    });
    list.innerHTML = ul;
  };

  
chat =function(id){
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
}
