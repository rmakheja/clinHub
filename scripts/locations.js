

displayLocations = function(){
  var list = document.getElementById('location_list');
  if(list == null)
      return;
  list.innerHTML = '';
  var ul = ''
  if(currentUser.isAdmin == 'yes')
    ul = '<tr class="item" id = "new" contentEditable = true>'+
          '<td  contentEditable = false><i class="fa fa-plus" style="color:red" onclick="addLocation()"></i></td>'+
          '<td> </td><td> </td><td> </td><td  contentEditable = false></td></tr>'
  locations_values.forEach(function(location){

    temp_row = '<td>' + location.name + '</td>' +
          '<td><a href="tel:' + location.cellphone + '">' + location.cellphone + '</a></td>'+
          '<td>' + location.needsAssignment + '</td>'
        if(currentUser.isAdmin == "yes")
          ul += '<tr class="item" id = "'+location.key+'"><td  contentEditable = false><i class="fa fa-edit" style="color:red" onclick="edit(\''+ location.key+'\')"></i></td>'+
                temp_row + 
                '<td  contentEditable = false><i class="fa fa-close" style="color:red" onclick="deleteLocation(\''+ location.key+'\')"></i></td></tr>';
        else 
          ul += '<tr class="item"><td> </td>' + temp_row + '<td> </td></tr>';
  })
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
    loadUsers().then(function(){
      loadLocations().then(function(){
      displayLocations();
    }).catch(function(error){
        console.log("some error - " + error);
    });
    }).catch(function(error){
        console.log("some error - " + error);
    });  


    home.hidden = false;
    
  } else {
    unLoadDb()
    currentUser = '';
    login.hidden = false;
    home.hidden = true;
    signOut.hidden = true;
    userPic.src= "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";
    userPic1.src= "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg;"
  }
};


addLocation = function(){
  newRow = document.getElementById("new")
  cols = newRow.getElementsByTagName("td")
  locationRef = firebase.database().ref('locations/')
  assign = cols[3].innerText
  if( assign == " ")
    assign = "no"
  locationRef.push({
    "name" :  cols[1].innerText,
    "cellPhone" : cols[2].innerText,
    "needsAssignment" : assign
  })
  table = newRow.parentElement

  newR ='<tr class="item" id = "new" contentEditable = true>'+
          '<td contentEditable = false><i class="fa fa-plus" style="color:red" onclick="addLocation()"></i></td>'+
          '<td> </td><td> </td><td> </td><td> </td></tr>'+
          '<tr class="item" id = "'+id+'"><td><i class="fa fa-edit" style="color:red" onclick="edit(\''+ id +'\')"></i></td>'+
          '<td>'+cols[1].innerText+'</td>' +
          '<td>'+ cols[2].innerText+'</td>'+
          '<td>'+ assign +'</td>'+
          '<td  contentEditable = false><i class="fa fa-close" style="color:red" onclick="deleteLocation(\''+ id+'\')"></i></td></tr>';
  table.removeChild(newRow)
  table.innerHTML = newR + table.innerHTML
}


edit = function(id){
  
  row = document.getElementById(id);
  row.contentEditable = true;
  cols = row.getElementsByTagName("td")
  col = cols[0]
  col.innerHTML = '<td><i class="fa fa-upload" style="color:red" onclick="save(\''+ id+'\')"></i></td>'
}

save = function(id){
  row = document.getElementById(id);
  row.contentEditable = false;
  cols = row.getElementsByTagName("td")
  //save the row
  locationRef = firebase.database().ref('locations/' + id)
  assign = cols[3].innerText
  if( assign == " ")
    assign = "no"
  locationRef.update({
    "name" :  cols[1].innerText,
    "cellPhone" : cols[2].innerText,
    "needsAssignment" : assign
  })
  col = cols[0]
  col.innerHTML = '<td><i class="fa fa-edit" style="color:red" onclick="edit('+ id+')"></i></td>'
}

deleteLocation = function(id){
  if(confirm("Are you sure you want to proceed for deletion")){
    locationRef = firebase.database().ref('locations/'+id)
    locationRef.remove();
    row = document.getElementById(id);
    table = row.parentElement;
    table.removeChild(row);
  }
}