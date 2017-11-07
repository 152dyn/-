
//  检测是否ie识别
function hasQuickTime(){
	var result = hasPlugin("QuickTime");
    if (!result){
        result = hasIEPlugin("QuickTime.QuickTime");
    }
 	return result;
}
//   Flash alert(hasFlash());
//   QuickTime alert(hasQuickTime());

//     在非 IE 中    
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

//   IE 中的  
function hasIEPlugin(name){
    try {
        new ActiveXObject(name);
        return true;
    } catch (ex){
        return false;
} }
//   Flash alert(hasIEPlugin("ShockwaveFlash.ShockwaveFlash"));
//   QuickTime alert(hasIEPlugin("QuickTime.QuickTime"));
