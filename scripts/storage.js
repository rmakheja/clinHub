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


loadData = function(user) {
  document.getElementById('rsr_mi').className = "active"
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
};


displayResources = function(parentPath){
  prevFolderPath = currFolderPath
  currFolderPath = parentPath
  var resourceContent = document.getElementById("resourcesContent");
  var content = '';
  var folders = []
  var files = []
  for (var folderId in folders_db){
    var folder = folders_db[folderId]
    if(folder.parent == parentPath){
      folders.push(folder)
    }
    if (parentPath == "/")
      currFolder = "/"
    else if(folder.path == parentPath){
      currFolder = folder.name
      upFolderPath = folder.parent
    }
  }
  for(var fileId in files_db) {
    var file = files_db[fileId]
    if(file.parent == parentPath)
      files.push(file)
  }

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
          content += '<input type="checkbox" name="forDeletion" value="'+ file.path +'" class="checkbox">' +
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
displayFile = function(path){
  
  var resourceContent = document.getElementById("resourcesContent");
  var file = files_db[path]
  prevFolderPath = currFolderPath
  currFolderPath = file.parent
  upFolderPath = file.parent
  var typ = typeDict[file.type]
  var content = '<tr><td>'
  if(typ == undefined){
    if(file.type.indexOf("video") != -1)
      typ = "video"
    else if (file.type.indexOf("audio") != -1)
      typ ="audio"
    else
      typ = "file"
  }
  content += '<input type="checkbox" name="forDeletion" value="'+ path +'" class="checkbox">' +
             '<a target ="_blank" href="'+ path +'"><i style="font-size:300%" class="fa fa-file-'+typ+'-o"></i></a>' +
            '</td></tr><tr>' +
            '<td class="name">'+ file.name +'</td></tr>'
  resourceContent.innerHTML = content;
  document.getElementById("path").innerHTML = "ClinHub" + currFolderPath  
}

function handleFileSelect(evt) {
  var storageRef = firebase.storage().ref();
  evt.stopPropagation();
  evt.preventDefault();
  var file = evt.target.files[0];
  // var type = file.type.substring(file.type.indexOf("/") + 1)
  var metadata = {'contentType': file.type};
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

uploadFolder = function(name) {
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
    if(path.indexOf("/") != 0)
      path = "/" + path
    
    if(path in files_db) {
      displayFile(path)
      found = false;
    } else{
      if (path.lastIndexOf("/") != path.length - 1)
      path = path + "/"
      if(path in folders_db){
        displayResources(path)
        found = false;
      }
    }

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
  if(confirm("Are you sure you want to proceed for deletion")) {
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
        console.log()
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
    for(var fp in folders_db) {
      deletedFolders.forEach(function(f){
        if (fp.startsWith(f)){
          fRef = firebase.database().ref("folders/"+ folders_db[fp].key)  
          fRef.remove();
          delete folders_db[fp]
        }
      })
    }
    for(var fp in files_db){
      deletedFolders.forEach(function(f){
        if (fp.startsWith(f)){
          fRef = firebase.database().ref("files/"+files_db[fp].key)  
          fRef.remove();
          delete files_db[fp]
        }
      })
      deletedFiles.forEach(function(f){
        if (fp == f){
          fRef = firebase.database().ref("files/"+ files_db[fp].key)  
          fRef.remove();
          delete files_db[fp]
        }
      })
    }
    displayResources(currFolderPath)
  }
}


