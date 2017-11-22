surveyLink = 'https://stonybrookuniversity.co1.qualtrics.com/jfe/form/SV_9uhdkSHB3pLbxXf?'
currFolderPath = ""
currDate = ""
currGroup = ""
groupStatus = {}
memberClass = class{
	constructor(key,object){
		this.key = key
		this.id = object["id"]
		this.name = object["name"]
	}
}

linkClass = class{
	constructor(key,object){
		this.key = key
		this.for = object["for"]
		this.date = object["date"]
		this.link = surveyLink + 'for=' + object["for"] + '&date=' + object["date"]
	}
}

onAuthStateChanged = function(user) {
  var home = document.getElementById('home');
  var login = document.getElementById("login");
  var userPic = document.getElementById('user-pic');
  var userPic1 = document.getElementById('user-pic1');
  var signOut = document.getElementById('sign-out');
  document.getElementById('sur_mi').className = "active"
  if (user) { 
    login.hidden = true;
    signOut.hidden = false;
    var profilePicUrl = user.photoURL; 
    currentUser = user;
    // userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    userPic.src = profilePicUrl;
    userPic1.src = profilePicUrl;
    if(user.email == 'rashmakheja@gmail.com'){
	    loadUsers("").then(function(){
	        loadSchedules("").then(function(){
	        	createSurveys()
	    	}).catch(function(error){
	        	console.log("some error - " + error);
	      	});
	    }).catch(function(error){
	        console.log("some error - " + error);
	      });
	}
	else {
        loadUsers("").then(function(){
	        loadSurveyLinks("").then(function(){
	        	displaySurveyLinks("/")
	    	}).catch(function(error){
	        	console.log("some error - " + error);
	      	});
	    }).catch(function(error){
	        console.log("some error - " + error);
	      });
	}
    
    home.hidden = false;
    
  } else {
    
    messageList = [];
    userList = [];
    physicianList = [];
    locationList = [];
    foldersList = [];
    appList = [];
    filesList = [];
    surveyDict = {};
    groupStatus = {};
    currentUser = '';
    login.hidden = false;
    home.hidden = true;
    signOut.hidden = true;
    userPic.src= "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";
    userPic1.src= "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg;"
  }
};


// loadSurveys = function(){
// 	currFolderPath = "/"
// 	surveysRef = firebase.database().ref('/surveyGroups/');
// 	return new Promise(function(res, rej){
// 		surveysRef.on("value", function(snapshot) {
// 			surveyDict = {}
// 			var dates = snapshot.val();
// 			for (var dateID in dates)
// 			{
				
// 				if(dates.hasOwnProperty(dateID)){
// 					groupDict = {}
// 					groups = dates[dateID]
// 					for(var group_name in groups){
// 						membersList = {}
// 						groupStatus[group_name] = groups[group_name]["surveySent"]
// 						members = groups[group_name]["members"]
// 						for(memberId in members){
// 							var member = new memberClass(memberId,members[memberId])
// 							membersList[member.id] = member
// 						}
// 						groupDict[group_name] = membersList
// 					}
// 					surveyDict[dateID] = groupDict
// 				}
// 			}
// 			res();
// 		}, function (error) {
// 			console.log("Error: " + error.code);
// 			rej(error);
// 		});

// 	});
// }

// displaySurveys = function(path){
//   document.getElementById("copy").hidden = false;
//   document.getElementById("add").hidden = false;
//   document.getElementById("users").hidden = true;
//   var surveyContent = document.getElementById("surveysContent");
//   var content = '';
//   foldersList = []
//   if (path == '/')
//   	foldersList = Object.keys(surveyDict)
//   else if(currFolderPath == '/') {
//   	foldersList = Object.keys(surveyDict[path])
//   	currDate = path
//   	currFolderPath += path + "/"
//   }
//   else {
//   	currGroup = path
//   	currFolderPath += path + "/"
// 	displayMembers(path)
// 	return;
//   }
//   var foldLen = foldersList.length
//   var noOfrows = foldLen/4
//   for (i = 0;i < noOfrows; i++) {
//     names = []
//     content += '<tr>'
//       for(j = 0; j < 4; j++) {
//         content += '<td>'
//         if(foldLen != 0) {
//             folder = foldersList[foldLen - 1]
//             content += '<input type="radio" name="forCopying" value="'+folder+'" class="checkbox">'+
//             '<button onclick="displaySurveys(\''+folder+'\')" class="mdl-button mdl-js-button mdl-button--fab"><i class="fa fa-folder"></i></button>'
//             foldLen -= 1
//             names.push(folder)
//         }
//         content += '</td>'
//       }
//     content += '</tr><tr>'
//     names.forEach(function(name){content += '<td class="name">'+name+'</td>'})
//     content += '</tr>'
//   }
//   surveyContent.innerHTML = content;
//   document.getElementById("path").innerHTML = "Surveys" + currFolderPath
// }


// displayMembers = function(group){
// 	document.getElementById("copy").hidden = true;
// 	document.getElementById("add").hidden = true;
// 	document.getElementById("users").hidden = false;
// 	var surveyContent = document.getElementById("surveysContent");
// 	var content = '';
// 	membersList = surveyDict[currDate][group]
// 	displayUsers()
// 	ul = '';
// 	for (var memberId in membersList){
// 		member = membersList[memberId]
//       	ul += '<li id="'+ member.id +'" style="text-align: left; padding-top:5px;"><span>'+ member.name + '</span>' +
//       	'<span style="float: right;">' +
//       	'<i class="fa fa-close" style="color:red" onclick="deleteMember('+ member.id+')"></i>' +
//         '</span></li>'
//     }
//     surveyContent.innerHTML = ul;
// 	document.getElementById("path").innerHTML = "Surveys" + currFolderPath
// }

// displayUsers = function(){
  
//   var list = document.getElementById('user_list');
//   list.innerHTML = '';
//   var ul = '';
//   if (!(currentUser.key in surveyDict[currDate][currGroup]))
//   		ul += '<li id="'+currentUser.key+'"class="media item"'+'" onclick="addMember(this.id)">'+
//           '<div class="media-body">'+
//             '<div class="media">'+
//              '<a class="pull-left" href="#">'+
//                '<img class="media-object img-circle" style="max-height:40px;" src="'+currentUser.picUrl+'" />'+
//               '</a>'+
//                '<div class="media-body">'+
//                   '<h6 style="margin: 10px 0px;">'+currentUser.firstname +' '+ currentUser.lastname +'</h6>'+
//               // '<small class="text-muted">Active From 3 hours</small>'+
//             '</div>'+
//           '</div>'+
//          '</div>'+
//     '</li>';
    
  
//   for(var userId in userList){
//     user = userList[userId];
//   	if(!(user.key in surveyDict[currDate][currGroup]))
//       ul += '<li id="'+user.key+'"class="media item"'+'" onclick="addMember(this.id)">'+
//           '<div class="media-body">'+
//             '<div class="media">'+
//              '<a class="pull-left" href="#">'+
//                '<img class="media-object img-circle" style="max-height:50px;" src="'+user.picUrl+'" />'+
//               '</a>'+
//                '<div class="media-body">'+
//                   '<h6 style="margin: 10px 0px;">'+user.firstname +' '+ user.lastname +'</h6>'+
//               // '<small class="text-muted">Active From 3 hours</small>'+
//             '</div>'+
//           '</div>'+
//          '</div>'+
//     '</li>'
    
//   };
//   list.innerHTML = ul;
// }

// addMember = function(id){
//   user = currentUser
//   if(id != currentUser.key)
//   	user = userList[id]
//   name = user.firstname + ' ' + user.lastname
//   membersRef = firebase.database().ref('/surveyGroups'+currFolderPath+'members/');
//   membersRef.push({
//     "id" : id,
//     "name" : name
//   })
//   rem = document.getElementById(id)
//   table = rem.parentElement;
//     table.removeChild(rem);
//   var surveyContent = document.getElementById("surveysContent");
//   newMember = '<li id="'+ id +'" style="text-align: left; padding-top:5px;"><span>'+ name + '</span>' +
//       	'<span style="float: right;">' +
//       	'<i class="fa fa-close" style="color:red" onclick="deleteMember('+ id +')"></i>' +
//         '</span></li>'
//   surveyContent.innerHTML += newMember

// }
// //back()
// deleteMember = function(id){
// 	member = surveyDict[currDate][currGroup][id]
// 	key = member.key
// 	membersRef = firebase.database().ref('/surveyGroups'+currFolderPath+'members/'+key);
// 	membersRef.remove()
// 	rem = document.getElementById(id)
//   	table = rem.parentElement;
//     table.removeChild(rem);
  
// 	var listContent = document.getElementById("user_list");
//   	user = currentUser
//   	if(id != currentUser.key)
//   		user = userList[id]
//   	remMember = 
//          '<li id="'+id+'"class="media item"'+'" onclick="addMember(this.id)">'+
//           '<div class="media-body">'+
//             '<div class="media">'+
//              '<a class="pull-left" href="#">'+
//                '<img class="media-object img-circle" style="max-height:40px;" src="'+user.picUrl+'" />'+
//               '</a>'+
//                '<div class="media-body">'+
//                   '<h6 style="margin: 10px 0px;">'+member.name +'</h6>'+
//               // '<small class="text-muted">Active From 3 hours</small>'+
//             '</div>'+
//           '</div>'+
//          '</div>'+
//     '</li>';
//    listContent.innerHTML += remMember
// }
//addGroup()
//deleteGroup()
//addDate()
//deleteDate()
//copy functions
// sendSurvey = function(){
// 	members = surveyDict[currDate][currGroup]
// 	for(var memberId in members){
// 		mysurveysRef = firebase.database().ref('surveys/'+memberId)
// 		for(var memberId2 in members){
// 			if(memberId2 != memberId){
// 				mysurveysRef.push({
// 					"for" : members[memberId2].name,
// 					"date" : currDate 
// 				})
// 			}
// 		}
// 	}
// }

// displaySurveyLinks = function(){
// 	document.getElementById("copy").hidden = true;
// 	document.getElementById("add").hidden = true;
// 	document.getElementById("send").hidden = true;
// 	document.getElementById("users").hidden = true;
// 	var surveyContent = document.getElementById("surveysContent");
// 	var content = '';
// 	ul = '';
// 	linksList.forEach(function(linkObj){
// 		ul += '<li><a href="' + linkObj.link +'">' + linkObj.date + ' || ' + linkObj.for + '</a></li>';
// 	})
// 	surveyContent.innerHTML = ul;	
// }

// loadSurveyLinks = function(){
// 	mysurveysRef = firebase.database().ref('surveys/'+ currentUser.key)
// 	linksList = []
// 	return new Promise(function(res, rej){
// 		mysurveysRef.on("value", function(snapshot) {
// 			var links = snapshot.val();
// 			for (var linkID in links)
// 			{				
// 				if(links.hasOwnProperty(linkID)){
// 					link = new linkClass(linkID, links[linkID])
// 					linksList.push(link)
// 				}
// 			}
// 			res();
// 		}, function (error) {
// 			console.log("Error: " + error.code);
// 			rej(error);
// 		});

// 	});
// }

updateStatus = function(assignment){
  facultyRef = firebase.database().ref('/surveys/'+assignment.faculty + "/");
  
  //if survey pair is in surveys that means survey is sent for that pair
  if(!(assignment.crna in surveys_db[assignment.attending])) {
    facultyRef.child(assignment.crna).set({
      "date" : assignment.date,
      "status" : "sent",
      "type" : "crna"
    })
    surveys_db[assignment.attending][assignment.crna] = new Survey ({
      "date" : assignment.date,
      "status" : "sent",
      "type" : "crna"
    }
  }
  if(!(assignment.resident in surveys_db[assignment.attending])) {
    facultyRef.child(assignment.resident).set({
      "date" : assignment.date,
      "status" : "sent",
      "type" : "resident"
    })
    surveys_db[assignment.attending][assignment.resident] = new Survey ({
      "date" : assignment.date,
      "status" : "sent",
      "type" : "resident"
    }
  }
  crnaRef = firebase.database().ref('/surveys/'+assignment.crna + "/");
  if(!(assignment.resident in surveys_db[assignment.crna])) {
    crnaRef.child(assignment.crna).set({
      "date" : assignment.date,
      "status" : "sent",
      "type" : "resident"
    })

    surveys_db[assignment.crna][assignment.resident] = new Survey ({
      "date" : assignment.date,
      "status" : "sent",
      "type" : "resident"
    }
  }

  if(!(assignment.attending in surveys_db[assignment.crna])) {
    crnaRef.child(assignment.attending).set({
      "date" : assignment.date,
      "status" : "sent",
      "type" : "faculty"
    })

    surveys_db[assignment.crna][assignment.attending] = new Survey ({
      "date" : assignment.date,
      "status" : "sent",
      "type" : "faculty"
    })
  }
}
createSurveys(){
  now = new Date();
  year = now.getFullYear().toString();

  //if month is in monthlySurveys that means survey is sent for that month
  for(var i = 0; i < month; i++){
    if(!(i in monthlySurveys)){
      var scheduleDate = year + "-" + i.toString() + "-01"
      end = start = year + "-" + (i+1).toString() + "-01"
      var day = 1
      while(scheduleDate < end){
        if(scheduleDate in schedule_db){
          curSchedule = schedule_db[scheduleDate]
          for(var room in curSchedule){
            assignment = curSchedule[room]
            updateStatus(assignment)
          }
        }
        day = day + 1
        scheduleDate = year + "-" + i.toString() + "-" + day.toString()
      }
    }
  }
}


