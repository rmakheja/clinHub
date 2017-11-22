
selectedUsers = [];
selectedRooms = [];
currentDate = '';


onAuthStateChanged = function(user) {
  var home = document.getElementById('home');
  var login = document.getElementById("login");
  var userPic = document.getElementById('user-pic');
  var userPic1 = document.getElementById('user-pic1');
  var signOut = document.getElementById('sign-out');
  document.getElementById('sch_mi').className = "active"
  if (user) {
    login.hidden = true;
    signOut.hidden = false;
    var profilePicUrl = user.photoURL; 
    currentUser = user;
    // userPic.style.background = 'url(' + profilePicUrl + ')';
    userPic.src = profilePicUrl;
    userPic1.src = profilePicUrl;
    loadSchedules().then(function(){
      loadLocations();
      loadUsers();
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

displaySchedule = function(){
    selectedUsers = [];
	selectedRooms = [];
    currentDate = document.getElementById("date").value.toString()

    var list = document.getElementById("schedule_list")
	list.innerHTML = '';
 	var ul = ''
	if(currentDate == ""){
		currentDate = prompt("Please enter date in format(mm-dd-yyyy):", " ");
	}
	parsedDate = Date.parse(currentDate)
	if(isNaN(parsedDate)){
		return;
	}
	year = new Date(currentDate).getFullYear()
	yearSchedules_db = schedules_db[year]
	schedule_date = {}
	if(currentDate in yearSchedules_db)
		schedule_date = yearSchedules_db[currentDate]
	
    for(var room in schedule_date){
    	scheduleObject = schedule_date[room]
	    ul += '<tr>'+
	          '<td>'+ locations_db[room].name +'</td>' +
	          '<td>'+ getUserName(users_db[scheduleObject.attending]) +'</td>' +
	          '<td>' + getUserName(users_db[scheduleObject.resident]) +'</td>'+
	          '<td>' + getUserName(users_db[scheduleObject.crna]) +'</td>'+
	          '<td> </td></tr>';
	    selectSchedule(schedule_date[room])
	};
	var options = '<tr id = "new">'+
				  '<td> <select id = "room" name="Room">' + getRooms() + '</select></td>'+
			 	  '<td> <select id = "attending" name="Attending">' + getUsers("Faculty") + '</select></td>'+
			 	  '<td> <select id = "resident" name="Resident">' + getUsers("Resident") + '</select></td>'+
			 	  '<td> <select id = "crna" name="CRNA">' + getUsers("CRNA") + '</select></td>'+
			 	  '<td><i class="fa fa-plus" style="color:red" onclick="addAssignment()"></i></td>'+
			 	  '</tr>';
   list.innerHTML = options + ul;
}

getUsers = function(role){
	options ='';
	for (var user in users_db){
		if (users_db[user].role == role && !selectedUsers.includes(user)){
			options += getUserOption(users_db[user])
		}
	}
	return options;
}
getRooms = function(){
	options ='';
	for (var roomId in locations_db){
		var room = locations_db[roomId]
		if (!selectedRooms.includes(roomId) && room.needsAssignment){
			options += '<option value="' + roomId + '">' + room.name + '</option>'
		}
	}
	return options;
}
getUserOption = function(user){
	return '<option value="' + user.key + '">' + user.firstname + ' ' + user.lastname + '</option>'
}

selectSchedule = function(scheduleObject){
	selectedUsers.push(scheduleObject.attending)
	selectedUsers.push(scheduleObject.resident)
	selectedUsers.push(scheduleObject.crna)
	selectedRooms.push(scheduleObject.room)
}

addAssignment = function(){

	parsedDate = Date.parse(currentDate)
	if(isNaN(parsedDate)){
		return;
	}
	year = new Date(currentDate).getFullYear()
	yearSchedules_db = schedules_db
	table = document.getElementById('tableSchedule')
	newR = document.getElementById('new')
	var e = document.getElementById("room");
	room = e.options[e.selectedIndex].value;
	e = document.getElementById("attending");
	attending = e.options[e.selectedIndex].value;
	e = document.getElementById("resident");
	resident = e.options[e.selectedIndex].value;
	e = document.getElementById("crna");
	crna = e.options[e.selectedIndex].value;
	scheduleRef = firebase.database().ref('schedule/' + year + '/' + currentDate + '/' + room);
	scheduleRef.set({
		"attending" : attending,
		"resident" : resident,
		"crna" : crna
	})
	var addRow = '<tr>'+
	          	 '<td>'+ locations_db[room].name +'</td>' +
	        	 '<td>'+ getUserName(users_db[attending]) +'</td>' +
	        	 '<td>' + getUserName(users_db[resident]) +'</td>'+
	        	 '<td>' + getUserName(users_db[crna]) +'</td>'+
	        	 '<td> </td></tr>';
	          
	selectedUsers.push(attending)
	selectedUsers.push(resident)
	selectedUsers.push(crna)
	selectedRooms.push(room)

	var options = '<td> <select id = "room" name="room">' + getRooms() + '</select></td>' +
			 	  '<td> <select id = "attending" name="attending">' + getUsers("Faculty") + '</select></td>'+
			 	  '<td> <select id = "resident" name="resident">' + getUsers("Resident") + '</select></td>'+
			 	  '<td> <select id = "crna" name="crna">' + getUsers("CRNA") + '</select></td>'+
			 	  '<td><i class="fa fa-plus" style="color:red" onclick="addAssignment()"></i></td>'
	newR.innerHTML = options;   
	table.innerHTML = table.innerHTML + addRow
}

