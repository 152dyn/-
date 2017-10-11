// 获取url参数信息


urlSearch: function () {
   let name, value
   let result = {}
   let str = location.href                       //取得整个地址栏
   let num = str.indexOf('?')
   str = str.substr(num + 1)                     //取得所有参数   stringvar.substr(start [, length ]
   let arr = str.split('&')                      //各个参数放到数组里
   for (let i = 0; i < arr.length; i++) {
     num = arr[i].indexOf('=')
     if (num > 0) {
       name = arr[i].substring(0, num)
       value = arr[i].substr(num + 1)
       result[name] = value
     }
   }
   return result
}

// xxx: 所需要查找的参数
// 调用方式：
	// let Request = UrlSearch()
	// Request.xxx

