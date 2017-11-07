// 如果页面运用相对多的css，需要很多计算。
// 周期性执行，都应该使用节流
// 一、
function throttle(method, context) {
	clearTimeout(method.tId);
	method.tId= setTimeout(function(){
           method.call(context);
    }, 100);
}
// 例：1
function resizeDiv(){ 
	var div = document.getElementById("myDiv");
	div.style.height = div.offsetWidth + "px";
}
window.onresize = function(){
    throttle(resizeDiv);
};
// 二、
var processor = {
	timeoutId: null,
	performProcessing: function(){
	},
	process: function(){
	    clearTimeout(this.timeoutId);
	    var that = this;
	    this.timeoutId = setTimeout(function(){
	        that.performProcessing();
		}, 100);
	} 
};	
