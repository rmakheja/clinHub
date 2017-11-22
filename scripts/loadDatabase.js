var users_db = {};
var user_values = [];
var locations_db = {};
var apps_db = {};
var schedules_db = {}; 
var messages_db = {};
var folders_db = {};
var files_db = {};
var monthlySurveys_db = {};
var surveys_db = {};
var surveyTypes_db = {};

loadSurveys = function(){
  surveysRef = firebase.database().ref('/surveys/');
  return new Promise(function(res, rej){
    surveysRef.on("value", function(snapshot) {
      surveys_db = snapshot.val();
      res();
    }, function (error) {
      console.log("Error: " + error.code);
      rej(error);
    });
  });
}

loadSurveyTypes = function(){
  surveyLinksRef = firebase.database().ref('/surveyLinks/');
  return new Promise(function(res, rej){
    surveyLinksRef.on("value", function(snapshot) {
      surveyTypes_db = snapshot.val();
      res();
    }, function (error) {
      console.log("Error: " + error.code);
      rej(error);
    });
  });
}


loadMonthlySurveys = function(){
surveysRef = firebase.database().ref('/monthlySurveys/');
  return new Promise(function(res, rej){
    surveysRef.on("value", function(snapshot) {
      monthlySurveys_db = snapshot.val();
      res();
    }, function (error) {
      console.log("Error: " + error.code);
      rej(error);
    });
  });
}

loadApps = function(){
	appsRef = firebase.database().ref('Apps/');
	return new Promise(function(res, rej){
    appsRef.on(
    	"value",
    	function(snapshot) {
		    var apps = snapshot.val();
		    for (var appId in apps) {
  				if(apps.hasOwnProperty(appId)) {
  					apps_db[appId] = new App(appId, apps[appId]);
  				}
		    }
		    res();
    	},
    	function (error) {
	      console.log("Error: " + error.code);
	      rej(error);
  		}
	  	);
	});
    
};

loadLocations = function(){
	locationsRef = firebase.database().ref('locations/');
	return new Promise(function(res, rej){
	    locationsRef.on(
	    	"value",
		    function(snapshot) {
			    var locations = snapshot.val();
			      	for (var locationId in locations) {
			        	if(locations.hasOwnProperty(locationId)) {
			           		locations_db[locationId] = new Location(locationId, locations[locationId])
			          	}
			      	}
			    res();
		    },
		    function (error) {
		    	console.log("Error: " + error.code);
		      	rej(error);
		  	}
	  	);
	});
    
};

loadMessages = function(){
	messageRef = firebase.database().ref('messageThreads/');
  return new Promise(function(res, rej){
		messageRef.on(
  		"value",
			function(snapshot) {
      	var threads = snapshot.val();
       	for (var threadId in threads) {
        	if(threads.hasOwnProperty(threadId)){
        		var user1 = threads[threadId]["user1"]
        		var user2 = threads[threadId]["user2"]
        		var msgList = {};
          	var messages = threads[threadId]["messages"];
          	for(var msg in messages) {
            	msgList[msg] = new Message(msg, messages[msg].from, messages[msg].text);
          	}
          	if(user1 == currentUser.key) {
          		messages_db[user2] = new MessageThread(threadId,msgList,user2)
        		} else if(user2 == currentUser.key) {
            	messages_db[user1] = new MessageThread(threadId,msgList,user1)
        		}
        	}
     	  }
        res();
    	},
    	function (error) {
  	    console.log("Error: " + error.code);
	    	rej(error);
    	}
    ); 
  })
};

loadSchedules = function(){
  scheduleRef = firebase.database().ref('schedule/');
  return new Promise(function(res, rej){
    scheduleRef.on(
    	"value",
    	function(snapshot) {
    		var schedules = snapshot.val();
        for(var year in schedules){
          scheduleYear = {}
          yearSchedules = schedules[year]
      		for (var date in yearSchedules) {
      			scheduleDate = {}
      			if(yearSchedules.hasOwnProperty(date)){
           		rooms = yearSchedules[date]
           		for (var room in rooms){
           			scheduleDate[room] = new Schedule(date, room, rooms[room])
           		}
       			}
     			  scheduleYear[date] = scheduleDate
      		}
          schedules_db[year] = scheduleYear
        }
    		res();
    	},
    	function (error) {
    		console.log("Error: " + error.code);
    		rej(error);
  		}
  	);
  });
};

loadFolders = function(){
	foldersRef = firebase.database().ref('/folders/');
	return new Promise(function(res, rej){
    foldersRef.on(
    	"value",
    	function(snapshot) {
    		var folders = snapshot.val();
      		for (var folderId in folders) {
            if(folders.hasOwnProperty(folderId)){
          	 var obj = new Folder(folderId,folders[folderId])
            	folders_db[obj.path] = obj;
          	}
      		}
    		res();
    	},
    	function (error) {
   	    console.log("Error: " + error.code);
      	rej(error);
  		}
  	);
  });
}

loadFiles = function(){
	filesRef = firebase.database().ref('/files/');
	return new Promise(function(res, rej){
    filesRef.on(
    	"value",
    	function(snapshot) {
    		var files = snapshot.val();
    		for (var fileId in files) {
       		if(files.hasOwnProperty(fileId)){
            var obj = new File(fileId,files[fileId])
        		files_db[obj.path] = obj
      		}
    		}
    		res();
    	},
    	function (error) {
        console.log("Error: " + error.code);
        rej(error);
  		}
		);
  });
}

loadUsers = function(){
  userRef = firebase.database().ref('users/');
  return new Promise(function(res, rej){
    userRef.on(
    	"value",
    	function(snapshot) {
    		var users = snapshot.val();
    		for (var userId in users) {
      		id = parseInt(userId);
      		if(id > this.maxId)
      			this.maxId = id;
       		if(users.hasOwnProperty(userId)){
        		var user = new Physician(id, users[userId]);
        		if(user.email == currentUser.email){
        			this.newUser = false;
        			currentUser = user;
        		}
       	  	//users_db[id] = user;
            user_values.push(user);
    		  }
    		}
    		sortUsers();
        res();
    	},
    	function (error) {
    		console.log("Error: " + error.code);
    		rej(error);
  		}
  	);
  });
};

unLoadDb = function(){
  users_db = {};
  locations_db = {};
  apps_db = {};
  schedules_db = {}; 
  messages_db = {};
  folders_db = {};
  files_db = {};
}

sortUsers = function(){
  user_values.sort(function(a,b) {return getUserName(a) > getUserName(b) ? 1 : ((getUserName(b) > getUserName(a)) ? -1 : 0);} );
  user_values.foreach(function(user){users_db[user.key] = user})
}