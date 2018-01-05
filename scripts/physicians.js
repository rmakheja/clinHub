user_values = [];
contact = function(key){
    sessionStorage.setItem('chat_id', key);
    window.location.replace("index.html");
}

loadData = function(user) {
  document.getElementById('usr_mi').className = "active"
  displayUsers();
};

sortDisplay = function(){
  var param = document.getElementById("sort").value;
  user_values.sort(function(a,b) {return a[param] > b[param] ? 1 : ((b[param] > a[param]) ? -1 : 0);} );
  displayUsers();
}


displayUsers = function(){
  var list = document.getElementById('physician_list');
  list.innerHTML = '';
  var ul = '';
  if(currentUser.isAdmin == "yes")
    ul+='<tr class="item" id = "new" contentEditable = true>'+
        '<td  contentEditable = false><i class="fa fa-plus" style="color:red" onclick="addUser()"></i></td>'+
        '<td> </td><td> </td><td> </td><td> </td><td> </td><td>  </td><td  contentEditable = false></td></tr>'
  user_values.forEach(function(user){
    temp_row = '<td onclick="contact('+ user.key +')">'+user.firstname+'</td>' +
          '<td>'+user.lastname+'</td>' +
          '<td>'+ user.department+'</td>' +
          '<td><a href="tel:'+ user.cellphone +'">' + user.cellphone +'</a></td>'+
          '<td>'+ user.email +'</td>' +
          '<td>'+ user.role+'</td>'
        if(currentUser.isAdmin == "yes")
          ul += '<tr class="item" id = "'+user.key+'"><td  contentEditable = false><i class="fa fa-edit" style="color:red" onclick="edit('+ user.key+')"></i></td>'+
                temp_row + 
                '<td  contentEditable = false><i class="fa fa-close" style="color:red" onclick="deleteUser('+ user.key+')"></i></td></tr>';
        else 
          ul += '<tr class="item"><td> </td>' + temp_row + '<td> </td></tr>';
  })
  list.innerHTML = ul;
  };
edit = function(id){
  usr = users_db[id]
  document.getElementById("userForm").innerHTML += '<input type="submit" value="Submit" id="submit" onclick="save('+ id+')">'
  document.getElementById("userList").hidden = true;
  document.getElementById("userForm").hidden = false;
  document.getElementById("fname").value = usr.firstname
  document.getElementById("lname").value = usr.lastname
  document.getElementById("sbuemail").value = usr.email
  document.getElementById("gmail").value = usr.gmail
  document.getElementById("role").value = usr.role
  document.getElementById("cellphone").value = usr.cellphone
  document.getElementById("dept").value = usr.department
  document.getElementById("degree").value = usr.degree
  document.getElementById("division").value = usr.division
  document.getElementById("yesAdmin").checked = usr.isAdmin == "yes"
  document.getElementById("noAdmin").checked = usr.isAdmin == "no"
  


  // row = document.getElementById(id);
  // row.contentEditable = true;
  // cols = row.getElementsByTagName("td")
  // col = cols[0]
  // col.innerHTML = '<td><i class="fa fa-upload" style="color:red" onclick="save('+ id+')"></i></td>'
  // nameCol = cols[1]
  // nameCol.onclick = "";
}

save = function(id){
  fname = document.getElementById("fname").value;
  lname = document.getElementById("lname").value
  email = document.getElementById("sbuemail").value
  gmail = document.getElementById("gmail").value
  cellphone = document.getElementById("cellphone").value
  role = document.getElementById("role").value
  dept = document.getElementById("dept").value
  degree = document.getElementById("degree").value
  division = document.getElementById("division").value
  isAdmin = document.getElementById("yesAdmin").checked ? "yes" : "no"

  // //save the row
  userRef = firebase.database().ref('users/'+id)
  userRef.update({
    "firstname" : fname,
    "lastname" : lname,
    "email" : email,
    "gmail" : gmail,
    "role" : role,
    "cellPhone" : cellphone,
    "department" : dept,
    "degree" : degree,
    "division" : division,
    "isAdmin" : isAdmin
  })

  usr = users_db[id]
  usr.firstname = fname
  usr.lastname = lname
  usr.email = email
  usr.gmail = gmail
  usr.role = role
  usr.cellPhone = cellphone
  usr.department = dept
  usr.degree = degree
  usr.division = division
  usr.isAdmin = isAdmin

  usrform = document.getElementById("userForm")
  btn = document.getElementById("submit");
  usrform.removeChild(btn);
  usrform.hidden = true;
  document.getElementById("userList").hidden = false;
  row = document.getElementById(id);
  cols = row.getElementsByTagName("td")
  cols[1].innerText = fname
  cols[2].innerText = lname
  cols[3].innerText = dept
  cols[4].innerHTML = cellphone == "" ? "" : '<a href="tel:'+ cellphone +'">' + cellphone +'</a>'
  cols[5].innerText = email
  cols[6].innerText = role
  
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
    "cellPhone" : cols[5].innerText,
    "role" : cols[6].innerText,
    "degree" : " ",
    "division" : " ",
    "email" : cols[4].innerText,
    "secondaryphone" : " ",
    "picurl" : "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"
  })
  table = newRow.parentElement
  
  newR ='<tr class="item" id = "new" contentEditable = true>'+
          '<td contentEditable = false><i class="fa fa-plus" style="color:red" onclick="addUser()"></i></td>'+
          '<td> </td><td> </td><td> </td><td> </td><td>  </td><td> </td><td> </td></tr>'+
          '<tr class="item" id = "'+id+'"><td><i class="fa fa-edit" style="color:red" onclick="edit('+ id +')"></i></td><td onclick="contact('+ id +')">'+cols[1].innerText+'</td>' +
              '<td>'+cols[2].innerText+'</td>' +
              '<td>'+ cols[3].innerText+'</td>' +
              '<td><a href="tel:'+ cols[4].innerText + '">' + cols[4].innerText +'</a></td>'+
              '<td>'+ cols[5].innerText+'</td>' +
              '<td>'+ cols[6].innerText+'</td>' +
              '<td  contentEditable = false><i class="fa fa-close" style="color:red" onclick="deleteUser('+ id+')"></i></td></tr>';
  table.removeChild(newRow)
  table.innerHTML = newR + table.innerHTML
}

