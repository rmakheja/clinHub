
displayLocations = function(){
  var list = document.getElementById('location_list');
  if(list == null)
      return;
  list.innerHTML = '';
  var ul ='<tr class="item" id = "new" contentEditable = true>'+
          '<td  contentEditable = false><i class="fa fa-plus" style="color:red" onclick="addLocation()"></i></td>'+
          '<td> </td><td> </td><td> </td></tr>'
  locations_values.forEach(function(location){

    ul += '<tr class="item"><td> </td><td>' + location.name + '</td>' +
          '<td><a href="tel:' + location.cellphone + '">' + location.cellphone + '</a></td>'+
          '<td>' + location.needsAssignment + '</td>' +
          '</tr>'
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
    loadLocations().then(function(){
      displayLocations();
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
  userRef = firebase.database().ref('locations/')
  assign = cols[3].innerText
  if( assign == " ")
    assign = "no"
  userRef.push({
    "name" :  cols[1].innerText,
    "cellPhone" : cols[2].innerText,
    "needsAssignment" : assign
  })
  table = newRow.parentElement
  
  newR ='<tr class="item" id = "new" contentEditable = true>'+
          '<td contentEditable = false><i class="fa fa-plus" style="color:red" onclick="addLocation()"></i></td>'+
          '<td> </td><td> </td><td> </td></tr>'+
          '<tr class="item"><td> </td><td>'+cols[1].innerText+'</td>' +
          '<td>'+ cols[2].innerText+'</td>'+
          '<td>'+ assign +'</td>'+
          '</tr>';
  table.removeChild(newRow)
  table.innerHTML = newR + table.innerHTML
}

