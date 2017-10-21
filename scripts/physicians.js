  
contact = function(key){
    sessionStorage.setItem('chat_id', key);
    window.location.replace("index.html");
}

onAuthStateChanged = function(user) {
  var home = document.getElementById('home');
  var login = document.getElementById("login");
  var userPic = document.getElementById('user-pic');
  var userPic1 = document.getElementById('user-pic1');
  var signOut = document.getElementById('sign-out');
  document.getElementById('usr_mi').className = "active"
  if (user) { 
    login.hidden = true;
    signOut.hidden = false;
    var profilePicUrl = user.photoURL; 
    currentUser = user;
    // userPic.style.background = 'url(' + profilePicUrl + ')';
    userPic.src = profilePicUrl;
    userPic1.src = profilePicUrl;
    
    loadUsers().then(function(){
      displayUsers();
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

sortDisplay = function(){
  var param = document.getElementById("sort").value;
  userList.sort(function(a,b) {return a[param] > b[param] ? 1 : ((b[param] > a[param]) ? -1 : 0);} );
  // displayPhysicians(); 
  displayUsers();
}


displayUsers = function(){
    
    var list = document.getElementById('physician_list');
    list.innerHTML = '';
    var ul = '';
    ul+='<tr class="item" id = "new" contentEditable = true>'+
          '<td  contentEditable = false><i class="fa fa-plus" style="color:red" onclick="addUser()"></i></td>'+
          '<td> </td><td> </td><td> </td><td>  </td><td  contentEditable = false></td></tr>'
    userList.forEach(function(user){
        ul += '<tr class="item" id = "'+user.key+'"><td  contentEditable = false><i class="fa fa-edit" style="color:red" onclick="edit('+ user.key+')"></i></td><td onclick="contact('+ user.key +')">'+user.firstname+'</td>' +
              '<td>'+user.lastname+'</td>' +
              '<td>'+ user.department+'</td>' +
              '<td>'+ user.cellphone+'</td>'+
              '<td  contentEditable = false><i class="fa fa-close" style="color:red" onclick="deleteUser('+ user.key+')"></i></td></tr>';

    });
   list.innerHTML = ul;
  };
edit = function(id){
  console.log(id)
  row = document.getElementById(id);
  row.contentEditable = true;
  cols = row.getElementsByTagName("td")
  col = cols[0]
  col.innerHTML = '<td><i class="fa fa-upload" style="color:red" onclick="save('+ id+')"></i></td>'
  nameCol = cols[1]
  nameCol.onclick = "";
}

save = function(id){
  row = document.getElementById(id);
  row.contentEditable = false;
  cols = row.getElementsByTagName("td")
  //save the row
  userRef = firebase.database().ref('users/'+id)
  userRef.update({
    "firstname" : cols[1].innerText,
    "lastname" :  cols[2].innerText,
    "department" : cols[3].innerText,
    "cellPhone" : cols[4].innerText
  })

  col = cols[0]
  col.innerHTML = '<td><i class="fa fa-edit" style="color:red" onclick="edit('+ id+')"></i></td>'
  nameCol = cols[1]
  nameCol.onclick = '"contact('+id+')"';
}

deleteUser = function(id){
  if(confirm("Are you sure you want to proceed for deletion")){
    userRef = firebase.database().ref('users/'+id)
    userRef.remove();
    row = document.getElementById(id);
    table = row.parentElement;
    table.removeChild(row);
  }
}
addUser = function(){
  id = this.getId();
  newRow = document.getElementById("new")
  cols = newRow.getElementsByTagName("td")
  userRef = firebase.database().ref('users/'+id)
  userRef.set({
    "firstname" : cols[1].innerText,
    "lastname" :  cols[2].innerText,
    "department" : cols[3].innerText,
    "cellPhone" : cols[4].innerText,
    "role" :" ",
    "degree" : " ",
    "division" : " ",
    "email" : " ",
    "secondaryphone" : " ",
    "picurl" : "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"
  })
  table = newRow.parentElement
  
  newR ='<tr class="item" id = "new" contentEditable = true>'+
          '<td contentEditable = false><i class="fa fa-plus" style="color:red" onclick="addUser()"></i></td>'+
          '<td> </td><td> </td><td> </td><td>  </td><td></td></tr>'+
          '<tr class="item" id = "'+id+'"><td><i class="fa fa-edit" style="color:red" onclick="edit('+ id +')"></i></td><td onclick="contact('+ id +')">'+cols[1].innerText+'</td>' +
              '<td>'+cols[2].innerText+'</td>' +
              '<td>'+ cols[3].innerText+'</td>' +
              '<td>'+cols[4].innerText+'</td>'+
              '<td  contentEditable = false><i class="fa fa-close" style="color:red" onclick="deleteUser('+ id+')"></i></td></tr>';
  table.removeChild(newRow)
  table.innerHTML = newR + table.innerHTML


}
