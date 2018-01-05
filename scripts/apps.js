var apps_values = [];
displayApps = function(){
  var appContent = document.getElementById('appContent');
  if(appContent == null)
      return;
  appContent.innerHTML = '';
  
  var app_count = apps_values.length;
  var noOfrows = (app_count)/4;
  var content = ''
  var index = 0;
  for (i = 0;i < noOfrows; i++) {
    names = []
    content += '<tr class= "item">'
    for(j = 0; j < 4 && index < app_count; j++) {
      var app = apps_values[index]
      content +='<td class="media" onclick="'+ app.onclick +'">'+
                '<div class="media-left">'+
                '<a target="_blank" class="pull-left" href="'+ app.onclick +'">'+
                '<img class="media-object img-circle " style="max-height:100px;" src="'+ app.icon+'"></a>'+
                '</div>'+
                '<div class="media-body">'+
                '<h6 class="media-heading"><a target="_blank" href="'+ app.onclick +'">'+app.name +'</a></h6>'+
                '<p>'+ app.description +'</p>'+ 
                '</div></div></td>';
      index += 1;
    }
    content += '</tr>';
  }
  appContent.innerHTML = content;
};

loadData = function(user) {
  document.getElementById('app_mi').className = "active"
  loadApps().then(function(){
    apps_values = Object.values(apps_db)
    displayApps();
  }).catch(function(error){
    console.log("some error - " + error);
  });  
};
