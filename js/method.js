// 判断是否array
function isArray (arr) {
	if (!arr.isArray) {
		return Object.prototype.toString.call(arr) === "[object Array]";
	}else
	// 否则用IE9支持的isArray方法
		return Array.isArray(arr);
}
// 字符串头尾去空格
function trim(arr) {
	var re = /^\s+|\s+$/g;
	return arr.replace(re,"");
}

// 为dom增加className
function addClass(element,newClassName) {
	var arr = trim(element.className.split(/\s+/));
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == newClassName) {
			return;
		}
	}
	element.className += " " + newClassName;
	element.className = trim(element.className);
}

// 移除dom的className
function removeClass(element,oldClassName) {
	var arr = trim(element.className.split(/\s+/));
	var str = "";
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] != oldClassName) {
			str += arr[i] + " ";
		}
	}
	element.className = str;
}

// 为dom绑定事件
function addEvent(element,event,listener) {
	if (element.addEventListener) {
		element.addEventListener(event,listener,false);
	}else if (element.attachEvent) {
		element.attachEvent("on"+event,listener);
	}
}
// 移除dom事件
function removeEvent(element,event,listener) {
	if (element.removeEventListener) {
		element.removeEventListener(event,listener,false);
	}else if (element.detachEvent) {
		element.detachEvent("on"+event,listener);
	}
}
// 为dom绑定自定义方法
function addEventLsn(element,event,listener) {
	var eventName = event;
	// 把事件函数绑定到元素的自定义属性
	if (!element[event]) {
		element[event] = [];
		element[event].push(listener);
	}else{
		element[event].push(listener);
	}
}
// 为dom绑定fire自定义事件
function fireEventLsn(element,event) {
	if (element[event]) {
		for (var i = 0; i < element[event].length; i++) {
			element[event][i]();
		};
	}else{
		return;
	}
}
// 为dom移除自定义事件
function removeEvent(element,event,listener) {
	if (!listener) {
		element[event] = null;
	}else {
		if (element[event]) {
			for (var i = 0; i < element[event].length; i++) {
				if (element[event][i] == listener) {
					element[event].splice(i,1);
				};
			};
		};
	}
}

// 自己封装Ajax方法
// 参数 url 
// option是一个对象 包含的参数
// type: get/post
// data:请求时候发送的数据
// onsuccess:成功调用的函数
// onerror:失败调用的函数
function ajax(url,option) {
	var userdata = "";
	// 默认是get方式
	option.type = option.type || "get";
	if (window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
	}else {
		var xhr = new ActiveXObect("Microsoft.XMLHTTP")
	}
	// 请求数据的处理
	if (typeof option.data == "object") {
		for (var attr in option.data) {
			userdata += attr + "=" + option.data[attr] + "&";
		}
		userdata += userdata.substring(0,userdata.length-1);
	} else {
		userdata += option.data || "";
	}
	// 以get港式发送数据
	if (option.type.toLowerCase() == "get") {
		xhr.open("get",url+"?"+userdata,true);
		xhr.send(null);
	}else{
		xhr.setRequestHeader("content-type","application/x-www-form-urlencoded;charset=UTF-8")
		xhr.open("post",url,true);
		xhr.send(userdata);
	}
	// 请求的响应
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				option.onsuccess && option.onsuccess(xhr.responseText);
			} else {
				option.onerror && option.onerror(xhr.status);
			}
		};
	}
}
// 定义一个全局命名空间
// 方法和变量包括
// 本地存储模块 data
// 用户输入验证模块 validator
var g = {
	data:{
		getItem:function(name) {
			return JSON.parse(window.localStorage.getItem(name));
		},
		// 设置本地存储
		setItem:function(obj) {
			var str = JSON.stringify(obj);
			window.localStorage.setItem(obj.name,str);
		},
		removeItem:function(data) {
			window.localStorage.removeItem(data);
		}
	}
}