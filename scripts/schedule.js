
optionsDropdown = '';
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
      loadUsers().then(function(){initOptions()})
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
	rooms = sortSchedule(schedule_date)
	for(var ind in rooms){
    	room = rooms[ind]
    	if(room == " ")
    		room_name == " "
    	else 
    		room_name  = locations_db[room].name
    	scheduleObject = schedule_date[room]

	    ul += '<tr>'+
	          '<td>'+ room_name +'</td>' +
	          '<td>'+  getUserName(users_db[scheduleObject.attending]) +'</td>' +
	          '<td>' + getUserName(users_db[scheduleObject.resident]) +'</td>'+
	          '<td>' + getUserName(users_db[scheduleObject.crna]) +'</td>'+
	          '<td>' + getUserName(users_db[scheduleObject.surgeon]) +'</td>'+
	          '<td> </td></tr>';
	};
   list.innerHTML = optionsDropdown + ul;
}

getUsers = function(role){
	options = getBlankOption();
	user_values.forEach(function(user){
		if (user.role == role){
			if(role != 'Faculty' || user.department == 'Anesthesiology')
				options += getUserOption(user)
		}
	})
	return options;
}
getRooms = function(){
	options = '';
	locations_values.forEach(function(room){
		if(room.needsAssignment == "yes")
			options += '<option value="' + room.key + '">' + room.name + '</option>'
	})
	return options;
}
getUserOption = function(user){
	return '<option value="' + user.key + '">' + getUserName(user) + '</option>'
}
getBlankOption = function(){
	return '<option value=" ">  </option>'
}

addAssignment = function(){

	parsedDate = Date.parse(currentDate)
	if(isNaN(parsedDate)){
		return;
	}
	year = new Date(currentDate).getFullYear()
	yearSchedules_db = schedules_db
	table = document.getElementById('schedule_list')
	newR = document.getElementById('new')
	var e = document.getElementById("room");
	room = e.options[e.selectedIndex].value;
	room_name = e.options[e.selectedIndex].text
	e = document.getElementById("attending");
	attending = e.options[e.selectedIndex].value;
	attending_name = e.options[e.selectedIndex].text
	e = document.getElementById("resident");
	resident = e.options[e.selectedIndex].value;
	resident_name = e.options[e.selectedIndex].text
	e = document.getElementById("crna");
	crna = e.options[e.selectedIndex].value;
	crna_name = e.options[e.selectedIndex].text
	e = document.getElementById("surgeon");
	surgeon = e.options[e.selectedIndex].value;
	surgeon_name = e.options[e.selectedIndex].text
	
	scheduleRef = firebase.database().ref('schedule/' + year + '/' + currentDate + '/' + room);
	scheduleRef.set({
		"attending" : attending,
		"resident" : resident,
		"crna" : crna,
		"surgeon" : surgeon
	})
	var addRow = '<tr>'+
	          	 '<td>'+ room_name +'</td>' +
	        	 '<td>'+ attending_name +'</td>' +
	        	 '<td>' + resident_name +'</td>'+
	        	 '<td>' + crna_name +'</td>'+
	        	 '<td>' + surgeon_name +'</td>'+
	        	 '<td> </td></tr>';
	table.removeChild(newR)
	table.innerHTML =  optionsDropdown + addRow + table.innerHTML;
}
initOptions = function(){
	optionsDropdown = '<tr id = "new"><td> <select id = "room" name="room">' + getRooms() + '</select></td>' +
				 	  '<td> <select id = "attending" name="attending">' + getUsers("Faculty") + '</select></td>'+
				 	  '<td> <select id = "resident" name="resident">' + getUsers("Resident") + '</select></td>'+
				 	  '<td> <select id = "crna" name="crna">' + getUsers("CRNA") + '</select></td>'+
				 	  '<td> <select id = "surgeon" name="surgeon">' + getUsers("Surgery") + '</select></td>'+
				 	  '<td><i class="fa fa-plus" style="color:red" onclick="addAssignment()"></i></td></tr>'

}

sortSchedule = function(schedule_date){
	rooms = Object.keys(schedule_date)
	rooms.sort(function(a,b) {
		if(a == " ") return 1;
		if(b == " ") return -1;
		return locations_db[a].name > locations_db[b].name ? 1 : (locations_db[b].name > locations_db[a].name ? -1 : 0);} );
	return rooms;
}