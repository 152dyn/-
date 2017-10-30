//     在 IE 中    
function hasPlugin(name){
    name = name.toLowerCase();
	for (var i=0; i < navigator.plugins.length; i++){
		if (navigator.plugins [i].name.toLowerCase().indexOf(name) > -1){ 
			return true;
	  	} 
	}
    return false;
}
//   Flash alert(hasPlugin("Flash"));
//   QuickTime alert(hasPlugin("QuickTime"));