
var CookieUtil = {
    get: function (name){
        var cookieName = encodeURIComponent(name) + "=",
        cookieStart = document.cookie.indexOf(cookieName),
        cookieValue = null;
        if (cookieStart > -1){
            var cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1){
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
                cookieEnd = document.cookie.length;
            }
            return cookieValue; 23
        }
    },
    set: function (name, value, expires, path, domain, secure) {
        var cookieText = encodeURIComponent(name) + "=" +
                         encodeURIComponent(value);
        if (expires instanceof Date) {
            cookieText += "; expires=" + expires.toGMTString();
    }
        if (path) {
            cookieText += "; path=" + path;
    }          
        if (domain) {
            cookieText += "; domain=" + domain;
    }
        if (secure) {
            cookieText += "; secure";
    }
        document.cookie = cookieText;
    },
    unset: function (name, path, domain, secure){
        this.set(name, "", new Date(0), path, domain, secure);
    } 
};
//   设置cookie
CookieUtil.set("book", "Professional JavaScript");
//   读取cookie
CookieUtil.get("name")
//   删除cookie
CookieUtil.unset("name");
//   设置cookie,包括它的路径、域、失效日期
CookieUtil.set("name", "Nicholas", "/books/projs/", "www.wrox.com", new Date("January 1, 2010"));
//   删除刚刚设置的cookies
CookieUtil.unset("name", "/books/projs/", "www.wrox.com");
//   设置的安全的cookies
CookieUtil.set("name", "Nicholas", null, null, null, true);