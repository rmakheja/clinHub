var typeDict = {}
typeDict['application/pdf'] = "pdf"
typeDict['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = "word"
typeDict['image/png'] = "photo"
typeDict['image/jpg'] = "photo"
typeDict['image/jpeg'] = "photo"
typeDict['application/vnd.ms-excel'] = "excel"
typeDict['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = "excel"
typeDict['video'] = "video"
typeDict['audio'] = "audio"
currFolderPath = ""
currFolder = "/"
prevFolderPath = "/"
upFolderPath = "/"


folderClass = class{
  constructor(key,object){
    this.key = key
    this.name = object["name"]
    this.path = object["path"]
    this.parent = object["parent"]   
}
}

fileClass = class{
  constructor(key,object){
    this.key = key
    this.name = object["name"]
    this.path = object["path"]
    this.parent = object["parent"]   
    this.type = object["type"]
}
}

onAuthStateChanged = function(user) {
  var home = document.getElementById('home');
  var login = document.getElementById("login");
  var userPic = document.getElementById('user-pic');
  var userPic1 = document.getElementById('user-pic1');
  var signOut = document.getElementById('sign-out');
  document.getElementById('rsr_mi').className = "active"
  if (user) { 
    login.hidden = true;
    signOut.hidden = false;
    var profilePicUrl = user.photoURL; 
    currentUser = user;
    // userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    userPic.src = profilePicUrl;
    userPic1.src = profilePicUrl;
    document.getElementById('inputfile').addEventListener('change', handleFileSelect, false);
    loadFolders().then(function(){
      loadFiles().then(function(){
        displayResources("/")
      }).catch(function(error){
          console.log("some error - " + error);
        });
    }).catch(function(error){
        console.log("some error - " + error);
      });

    home.hidden = false;
    
  } else {
    
    messageList = [];
    userList = [];
    physicianList = [];
    locationList = [];
    foldersList = [];
    appList = [];
    filesList = [];
    currentUser = '';
    login.hidden = false;
    home.hidden = true;
    signOut.hidden = true;
    userPic.src= "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg";
    userPic1.src= "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg;"
  }
};

loadFolders = function(){
  foldersRef = firebase.database().ref('/folders/');
  return new Promise(function(res, rej){
        foldersRef.on("value", function(snapshot) {
          foldersList = []
        var folders = snapshot.val();
          for (var folderId in folders)
          {
             if(folders.hasOwnProperty(folderId)){
                var folder = new folderClass(folderId,folders[folderId]);
                foldersList.push(folder);
              }
          }
        res();
        }, function (error) {
          console.log("Error: " + error.code);
          rej(error);
      });
      
    });

}

loadFiles = function(){
  filesRef = firebase.database().ref('/files/');
  return new Promise(function(res, rej){
        filesRef.on("value", function(snapshot) {
          filesList = []
        var files = snapshot.val();
          for (var fileId in files)
          {
             if(files.hasOwnProperty(fileId)){
                var file = new fileClass(fileId,files[fileId]);
                filesList.push(file);
              }
          }
        res();
        }, function (error) {
          console.log("Error: " + error.code);
          rej(error);
      });
      
    });
}


displayResources = function(parentPath){
  prevFolderPath = currFolderPath
  currFolderPath = parentPath
  var resourceContent = document.getElementById("resourcesContent");
  var content = '';
  var folders = []
  var files = []
  foldersList.forEach(function(folder){
    if(folder.parent == parentPath){
      folders.push(folder)
    }
    
    if (parentPath == "/")
      currFolder = "/"
    else if(folder.path == parentPath){
      currFolder = folder.name
      upFolderPath = folder.parent
    }
  })
  filesList.forEach(function(file){
    if(file.parent == parentPath)
      files.push(file)
  })
  var foldLen = folders.length
  var filLen = files.length
  var noOfrows = (foldLen + filLen)/4
  content = ''
  for (i = 0;i < noOfrows; i++) {
    names = []
    content += '<tr>'
      for(j = 0; j < 4; j++) {
        content += '<td>'
        if(foldLen != 0) {
            folder = folders[foldLen - 1]
            content += '<input type="checkbox" name="forDeletion" value="'+folder.path+'" class="checkbox">'+
            '<button onclick="displayResources(\''+folder.path+'\')" class="mdl-button mdl-js-button mdl-button--fab"><i class="fa fa-folder"></i></button>'
            names.push(folder.name)
            folders.pop()
            foldLen -= 1
        }
        else if(filLen != 0) {
          var file = files[filLen - 1]
          var typ = typeDict[file.type]
          if(typ == undefined){
            if(file.type.indexOf("video") != -1)
              typ = "video"
            else if (file.type.indexOf("audio") != -1)
              typ ="audio"
            else
              typ = "file"
          }
          content += '<input type="checkbox" name="forDeletion" value="'+file.parent+file.name+'" class="checkbox">' +
          '<a target ="_blank" href="'+file.path+'"><i style="font-size:300%" class="fa fa-file-'+typ+'-o"></i></a>'
          names.push(file.name)
          files.pop()
          filLen -= 1;
        }
        content += '</td>'
      }
    content += '</tr><tr>'
    names.forEach(function(name){content += '<td class="name">'+name+'</td>'})
    content += '</tr>'
  }
  resourceContent.innerHTML = content;
  document.getElementById("path").innerHTML = "ClinHub" + currFolderPath
}
function handleFileSelect(evt) {
      var storageRef = firebase.storage().ref();
      evt.stopPropagation();
      evt.preventDefault();
      var file = evt.target.files[0];
      // var type = file.type.substring(file.type.indexOf("/") + 1)
      var metadata = {
        'contentType': file.type
      };

      // Push to child path.
      // [START oncomplete]
      
      p = currFolderPath+'/' + file.name
      storageRef.child(p).put(file, metadata).then(function(snapshot) {
        filesRef = firebase.database().ref('/files/');
        var url = snapshot.downloadURL;
        filesRef.push({
          "name": file.name,
          "path" : url,
          "parent": currFolderPath,
          "type": file.type
        })
      
      displayResources(currFolderPath);
      }).catch(function(error) {
        // [START onfailure]
        console.error('Upload failed:', error);
        // [END onfailure]
      });
      // [END oncomplete]
    }
createFolder = function(){
    
    var folderName = prompt("Please enter folder name:", "New Folder");
    if (folderName == null || folderName == "") {
        alert("Invalid value")
    } else {
        uploadFolder(folderName)
    }
}


function uploadFolder(name) {
      var storageRef = firebase.storage().ref();
      // storageRef.child(currFolderPath+'/' + name+'/foo.txt').put().then(function(snapshot) {
        foldersRef = firebase.database().ref('/folders/');
        p = currFolderPath + name + "/"
        foldersRef.push({
          "name": name,
          "path" : p,   
          "parent": currFolderPath// /new folder/
        })
      displayResources(currFolderPath);
      // }).catch(function(error) {
      //   console.error('Upload failed:', error);
      // });
    }
displayFromPath = function(path) {
  found = true;
  if (path == "" || path == null)
    displayResources(currFolderPath)
  else {
    if(path == "/"){
      displayResources("/")
      return;
    }
    else if (path.lastIndexOf("/") != path.length - 1)
        path = path + "/"
    if(path.indexOf("/") != 0)
        path = "/" + path
    foldersList.forEach(function(folder){
      if (folder.path == path){
        displayResources(path)
        found = false;
      }
    })
    if (found)
      document.getElementById("resourcesContent").innerHTML = ""
  }
}
back = function(){
  displayResources(prevFolderPath)
}
up = function(){
  displayResources(upFolderPath)
}
deleteFile = function(){
  if(confirm("Are you sure you want to proceed for deletion"))
  {
    var checkboxes = document.getElementsByName("forDeletion");
    var checkboxesChecked = [];
    var deletedFolders = []
    var deletedFiles = []
    var storageRef = firebase.storage().ref();
  // loop over them all
    for (var i=0; i<checkboxes.length; i++) {
     // And stick the checked ones onto an array...
     if (checkboxes[i].checked) {
      var path = checkboxes[i].value;
      var fileRef = storageRef.child(path);
      if(path.lastIndexOf("/") == path.length - 1)
        deletedFolders.push(path)
      else
        deletedFiles.push(path)
      fileRef.delete().then(function() {
        }).catch(function(error) {
          console.log(error)
        });
     }

  }
    foldersList.forEach(function(folder){
      deletedFolders.forEach(function(f){
        if (folder.path.startsWith(f)){
          fRef = firebase.database().ref("folders/"+folder.key)  
          fRef.remove();
        }
      })
    })

    filesList.forEach(function(file){
      fp = file.parent + file.name 
      deletedFolders.forEach(function(f){
        if (fp.startsWith(f)){
          console.log(f)
          fRef = firebase.database().ref("files/"+file.key)  
          fRef.remove();
        }
      })
      deletedFiles.forEach(function(f){
        if (fp == f){
          console.log(f)
          fRef = firebase.database().ref("files/"+file.key)  
          fRef.remove();
        }
      })
    })
    displayResources(currFolderPath)
  }
}


