now = new Date();
nowYear = now.getFullYear().toString()
nowMonth = now.getMonth()+1
limit = 3
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
    loadUsers().then(function(){
      loadSurveys().then(function(){
        loadSurveyTypes().then(function(){
          displaySurveys()
          if(currentUser.isAdmin == "yes"){
            document.getElementById("generate").hidden = false;
            document.getElementById("remind").hidden = false;
            document.getElementById("facultySurvey").hidden = false;
            document.getElementById("facultyURL").hidden = false;
            document.getElementById("crnaURL").hidden = false;
            document.getElementById("residentURL").hidden = false;
          }
        })
      })
    }).catch(function(error){
        console.log("some error - " + error);
    })
    
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



updateStatus = function(assignment, year){

  if(!(year in surveys_db))
    surveys_db[year] = {}
  yearSurveys = surveys_db[year]
  attending = assignment.attending
  crna = assignment.crna
  resident = assignment.resident
  
  
  //if survey pair is in surveys that means survey is sent for that pair
    if(attending && crna && (!(attending in yearSurveys) || !(crna in yearSurveys[attending]))) {
      var facultyRef = firebase.database().ref('/surveys/'+ year + '/' + attending + "/" + assignment.crna  + "/");
      facultyRef.set({
        "date" : assignment.date,
        "status" : "sent",
        "type" : "crna"
      })
      //check if this is necessary
      yearSurveys[attending] = {
        crna : {
          "date" : assignment.date,
          "status" : "sent",
          "type" : "crna"
        }
      }
    }

  if(attending && resident && (!(attending in yearSurveys) || !(resident in yearSurveys[attending]))) {
    var facultyRef = firebase.database().ref('/surveys/'+ year + '/' + attending + "/" + resident  + "/");
    facultyRef.set({
      "date" : assignment.date,
      "status" : "sent",
      "type" : "resident"
    })
    yearSurveys[attending]={
      resident : {
        "date" : assignment.date,
        "status" : "sent",
        "type" : "resident"
      }
    }
  }

  if(crna && resident && (!(crna in yearSurveys) || !(resident in yearSurveys[crna]))) {
    var crnaRef = firebase.database().ref('/surveys/' + year + '/' + crna + "/" + resident + "/");
    crnaRef.set({
      "date" : assignment.date,
      "status" : "sent",
      "type" : "resident"
    })
    
    yearSurveys[crna]={
      resident : {
        "date" : assignment.date,
        "status" : "sent",
        "type" : "resident"
      }
    }
  }

  if(attending && crna && (!(crna in yearSurveys) || !(attending in yearSurveys[crna]))) {
    var crnaRef = firebase.database().ref('/surveys/' + year + '/' + crna + "/" + attending + "/");
    crnaRef.set({
      "date" : assignment.date,
      "status" : "sent",
      "type" : "faculty"
    })

    yearSurveys[crna] = {
      attending : {
        "date" : assignment.date,
        "status" : "sent",
        "type" : "faculty"
      }
    }
  }
}
createSurveys = function(){
  for(var year in schedules_db){
    if(!(year in monthlySurveys_db))
      monthlySurveys_db[year] = {}

    month = 13
    if(nowYear == year)
      month = nowMonth
    //if month is in monthlySurveys that means survey is sent for that month
    for(var i = 1; i < month; i++){

      if(!(i in monthlySurveys_db[year])){
        iString = i.toString()
        i1String = (i+1).toString()
        if(i<10)
          iString = "0" + iString
        if(i<9)
          i1String = "0" + i1String

        var date = year + "-" + iString + "-01"
        end = year + "-" + i1String + "-01"
        var day = 1
        while(date < end && day < 31){            
          if(date in schedules_db[year]){
            curSchedule = schedules_db[year][date]
            for(var room in curSchedule){
              assignment = curSchedule[room]
              updateStatus(assignment, year)
            }
          }
          day = day + 1
          dayStr = day.toString()
          if(day<10)
            dayStr = "0" + dayStr
          date = year + "-" + iString + "-" + dayStr
        }
        monthlySurveyRef = firebase.database().ref('/monthlySurveys/' + year + '/' + i + '/');
        monthlySurveyRef.set("sent")
      }
    }
  }
}

displaySurveys = function(){
//send survey mail links to the user

  var list = document.getElementById("survey_list")
  list.innerHTML = '';
  var ul = ''
  count = 0
  for(var year in surveys_db){
    if(currentUser.key in surveys_db[year]){
      surveyList = surveys_db[year][currentUser.key]
      
      for (var forUser in surveyList){
        userSurvey = surveyList[forUser]

        if (userSurvey.status == "sent" && count <= limit){
          name = getUserName(users_db[forUser])
          var path = year + '/' + currentUser.key + '/' + forUser
          //link+'for=' + object["for"] + '&date=' + object["date"]
          link = surveyTypes_db[userSurvey.type]
          ul += '<tr id ="'+ path +'"><td>' + userSurvey.date + ' </td><td> ' + name + '</td><td><a href="' + link + '" target="_blank">' + link + '</a></td><td><i class="fa fa-check-circle" style="color:red" onclick="markFilled(\''+ path +'\')"></i></td></tr>';
          count += 1;
        }
      }
    }
  }
  list.innerHTML = ul;
}


generate = function(){
  loadSchedules().then(function(){
    loadMonthlySurveys().then(function(){
      createSurveys()
    })
  }).catch(function(error){
      console.log("some error - " + error);
  })
  alert("Surveys successfully created");
  displaySurveys()
  remind()
}

markFilled = function(path){
  if(confirm("Are you sure you completely filled this survey?")){
    //path = year + "/" + currentUser.key + "/" + user
     ref = firebase.database().ref('/surveys/' + path + "/status");
     ref.set("filled")
     el = document.getElementById(path)
     el.remove()
  }
}
addFacultySurveys = function(){
  var year = prompt("Enter Year for faculty surveys","YYYY");
  if(year < "1900" || year > nowYear){
    alert("Entered incorrect year")
    return
  }
  
  if(!(year in surveys_db))
    surveys_db[year] = {}
  yearSurveys = surveys_db[year]

  d = new Date().getDate().toString()
  date = year + "-" + nowMonth + "-" + d
  faculty = []
  
  for (var user in users_db){
    if (users_db[user].role == "Faculty" && users_db[user].department == "Anesthesiology"){
      for(user1 in faculty){
        if(!(user in yearSurveys) || !(user1 in yearSurveys[user])) {
          var facultyRef = firebase.database().ref('/surveys/'+ year + '/' + user + "/" + user1  + "/");
          facultyRef.set({
            "date" : date,
            "status" : "sent",
            "type" : "faculty"
          })
          //check if this is necessary
          yearSurveys[user] = {
            user1 : {
              "date" : date,
              "status" : "sent",
              "type" : "faculty"
            }
          }
        }
        if(!(user1 in yearSurveys) || !(user in yearSurveys[user1])) {
          var facultyRef = firebase.database().ref('/surveys/'+ year + '/' + user1 + "/" + user  + "/");
          facultyRef.set({
            "date" : date,
            "status" : "sent",
            "type" : "faculty"
          })
          //check if this is necessary
          yearSurveys[user1] = {
            user : {
              "date" : date,
              "status" : "sent",
              "type" : "faculty"
            }
          }
        }
      }
      faculty.push(user)
    }
  }
  alert("Surveys successfully created");
  displaySurveys()
}

updateURL = function(type){
  var url = prompt("URL for "+ type + " survey", "")
  if(url == null || !(url.startsWith("https://stonybrookuniversity.co1.qualtrics.com/"))){
    alert("incorrect URL")
    return
  }
  surveyLinkRef = firebase.database().ref('/surveyLinks/'+type +'/');
  surveyLinkRef.set(url);
}




remind = function(){
  for(var year in surveys_db){
    year_surveys = surveys_db[year]
    for(var by_user in year_surveys){
      user_surveys = year_surveys[by_user]
      send_email = false;
      for(var for_user in user_surveys){
        if(user_surveys[for_user]["status"] == "sent"){
          send_email = true
          break;
        }
      }

      if(send_email){
        userSurveyRef = firebase.database().ref('/surveys/' + year + '/' + by_user + '/send_email/');
        userSurveyRef.set("yes")
      }
    }
  }

}
