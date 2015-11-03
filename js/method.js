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
// 判断是否有className
function hasClass(element,className) {
	var cls = element.className;
	var realCls = trim(cls).replace.split(/\s+/);
	for (var i = 0; i < realCls.length; i++) {
		if (realCls[i] === className) {
			return true;
		};
	};
	return false;
}
// 为dom增加className
function addClass(element,newClassName) {
	var arr = trim(element.className).split(/\s+/);
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
	var arr = trim(element.className).split(/\s+/);
	var str = "";
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] != oldClassName) {
			str += arr[i] + " ";
		}
	}
	element.className = str;
}

// 为dom绑定事件
// 惰性加载函数
var addEvent = function(element,type,handler) {
	if (window.addEventListener) {
		addEvent = function(element,type,handler) {
			element.addEventListener(type,handler,false);
		}
	}else if (window.attachEvent) {
		addEvent = function(element,type,handler) {
			element.attachEvent("on"+type,handler);
		}
	}
	addEvent(element,type,handler);
}

// 移除dom事件
var removeEvent = function(element,type,handler) {
	if (window.removeEventListener) {
		addEvent = function(element,type,handler) {
			element.removeEventListener(type,handler,false);
		}
	}else if (window.detachEvent) {
		addEvent = function(element,type,handler) {
			element.detachEvent("on"+type,handler);
		}
	}
	removeEvent(element,type,handler);
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
// // 封装的一个getByClass 兼容低版本IE 返回一个包含所有classname的数组
// function getByClass(oparents,className) {
// 	var arr = [];
// 	var all = oparents.getElementsByTagName("*");
// 	console.log(all);
// 	for (var i=0,l=all.length;i<l;i++) {
// 		if (all[i].className) {
// 			var classNames = trim(all[i].className); 
// 		};
// 		var arr2 = classNames.split(/\s+/); //分开为一个数组
// 		for (var j=0,len=arr2.length;j<len;j++) {
// 			if (arr2[j] == className) {
// 				arr.push(arr2[j]);
// 			};
// 		}
// 	}
// 	return arr;
// }
// getQueryByAttr 返回所有符合的一个数组
// function getQuertAttr(selector) {
// 	// tag是一个数组
// 	var tags = document.getElementsByTagName("*");
// 	var arr = [];
// 	selector = trim(selector).substring(1,selector.length-1);
// 	if (selector.indexOf("=") != -1) {
// 		arr2 = selector.split("=");
// 		for (var i=0,len=tags.length;i<len;i++) {
// 			if (tags[i].getAttribute(arr2[0]) == arr2[1]) {
// 				arr.push(tags[i]);
// 			};
// 		}
// 	}else {
// 		for (var j=0;j<len;j++) {
// 			if (tags[i].getAttribute(selector) || tags[i].getAttribute(selector) == '') {
// 				arr.push(tags[j]);
// 			}
// 		}
// 	}
// 	return arr;
// }
// // 封装一个小的jquery
// function $(selector) {
// 	// 清除首尾空格
// 	selector = trim(selector);
// 	var arr = [];
// 	// 判断selector中间是否有空格
// 	var space = selector.indexOf(' ');
// 	if (space != -1) { 
// 	//如果中间有空格 分开查询
// 		arr = selector.split(/\s+/);	//以中间任意个空格分开
// 		for (var l=arr.length;l>1;l--) {
// 		return query(arr[l-1],arr[l-2]); //反向遍历数组 参数当作query函数的参数
// 		}
// 	}else {
// 		return query(selector); //返回结果
// 	}

// 	function query(selector,oparents) {
// 		// 如果arr[0]存在代表有拆分 用拆分的方式查询	
// 		console.log(selector);
// 		if (arr[0]) {
// 			oparents = $(arr[0]);
// 		}else {
// 			oparents = document;
// 		}
// 		switch(selector.charAt(0)) {
// 			case '#' :
// 				return document.getElementById(selector.substring(1));
// 				break;
// 			case '.' :
// 				return getByClass(oparents,selector.substring(1))[0];
// 			case '[' :
// 				return getQueryByAttr(selector);
// 				//默认的形式
// 				// 1、 tag
// 				// 2、 带class形式 p.class		
// 			default  :
// 				if (selector.indexOf(".") !== -1) {
// 					var arr = selector.split('.');
// 					return getByClass(document.getElementsByTagName(arr[0]),arr[1])[0];
// 				}else {
// 					return document.getElementsByTagName(selector)[0];
// 				}

// 		}
// 	}

// }
function $(selector) {
   
	//清除首尾空格
	selector = trim(selector);
	var arr = [];
	//判断selector中间是否有空格需要拆分
	var space = selector.indexOf(' ');

	//有空格的情况 拆分查询
	if (space != -1) {
		//以空格形式分割字符串 从得到的数组最后进行逆向查询
		arr = selector.split(/\s+/);
		for (var i = arr.length; i>1; i--) {
			return query(arr[i-1],arr[i-2]);
		}
	//无空格情况 直接查询
	} else {
		return query(selector);
	}


	//主要查询器
	function query(selector,oParent) {

		//selector 中间有空格被拆分了
		if (arr[0]) {
			oParent = $(arr[0]);
		} else {
			oParent = document;
		}

		//判断首字符
		switch (selector.charAt(0)) {
			case '#' :
				return document.getElementById(selector.substring(1));
				break;
			case '.' :
				return getClass(oParent,selector.substring(1));
				break;
			case '[' :
				//返回第一个属性匹配元素
				return getQueryAttr(selector);
				break;

			//默认形式：
			//1、纯标签形式，例如 p
			//2、带属性形式，例如 p[data]
			//3、带.class形式，例如 p.info
			default :

				//  第三种情况
				if (selector.indexOf('.') != -1) {
	
					var defArr = selector.split('.');
					return getClass(oParent, defArr[1], defArr[0]);
				} 
				//	第二种情况
				else if (selector.indexOf('[') != -1) {
					
					var defArr = selector.split('[');
					defArr[1] = "["+defArr[1];
					return getQueryAttr(defArr[1], defArr[0]);

				}
				// 第一种情况
				else {
					return oParent.getElementsByTagName(selector)[0];
				}
			
				break;
			}
	}

	//匹配[]选择器
	function getQueryAttr(attr,tagName) {
		tagName = tagName || '*';
		var aElem = document.getElementsByTagName(tagName);
		//去掉首尾[]
		attr = attr.substring(1,attr.length-1);
		//判断是否有=
		if (attr.indexOf('=') != -1) {
			var arr = attr.split('=');
			for (var i = 0; i<aElem.length; i++) {
				if (aElem[i].getAttribute(arr[0]) == arr[1]) {
					return aElem[i];
				}
			}
		} else {
			for (var i = 0; i<aElem.length; i++) {
				if (aElem[i].getAttribute(attr) || aElem[i].getAttribute(attr) == "") {
					return aElem[i];
				}
			}
		}
		return '';
	}

	//获取class元素，兼容ie低版本,返回第一个符合条件
	//三个参数，1、父级 2、class名 3、标签名
	function getClass(oParent,oClass,tagName) {
        tagName = tagName || "*";
        var aElem = oParent.getElementsByTagName(tagName);
        var arr = [];

        for (var i = 0; i<aElem.length; i++) {
            
            if (aElem[i].className) {
                
                //对每个元素的class名进行处理
                var classNames = trim(aElem[i].className);
                          
                var arr2 = classNames.split(/\s+/);
            
                for (var j = 0; j<arr2.length; j++) {
                    //返回第一个符合条件的元素
                    if (arr2[j] === oClass) {
                        return aElem[i];
                    }
                }
            }  
        }
        return '';
    }
}
// 模板引擎
// 调用方式
// <script id="tpl" type="text/plain">
//    <p>Today: { date }</p>
// </script>
// function Template (tpl) {
// 	var fn,
// 		match,
// 		code = ['var r=[]'], //用于new Function创建一个函数
// 		re = /\{\s*([a-zA-Z\.\_0-9()]+)\s*\}/m, //匹配{}中的任何情况
// 		addLine = function(text) {
// 			 code.push('r.push(\'' + text.replace(/\'/g, '\\\'').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '\');');
// 		};
// 		while (match = re.exec(tpl)) {
// 			if (match.index>0) {
// 				addLine(tpl.splice(0,match.index));
// 			}
// 			//解析完一段后 把解析的结果push到r 到后面的Function创建函数
// 			code.push('r.push(this.'+match[1]+');');
// 			tpl = tpl.substring(match.index+match[0].length); //从下一段的tpl重新解析
// 		}
// 		addLine(tpl);
// 		code.push('return r.join(\'\'):');
// 		// 创建函数 利用字符串创建了一个函数
// 		fn = new Function(code.join('\n'));
// 		// render()调用函数并绑定this参数
// 		this.render = function(model) {
// 			return fn.apply(model);
// 		}
// }
function Template(tpl) {
    var
        fn,
        match,
        code = ['var r=[];'],
        re = /\{\s*([a-zA-Z\.\_0-9()]+)\s*\}/m,
        addLine = function (text) {
            code.push('r.push(\'' + text.replace(/\'/g, '\\\'').replace(/\n/g, '\\n').replace(/\r/g, '\\r') + '\');');
        };
    while (match = re.exec(tpl)) {
        if (match.index > 0) {
            addLine(tpl.slice(0, match.index));
        }
        code.push('r.push(this.' + match[1] + ');');
        tpl = tpl.substring(match.index + match[0].length);
    }
    addLine(tpl);
    code.push('return r.join(\'\');');
    // 创建函数:
    fn = new Function(code.join('\n'));
    // 用render()调用函数并绑定this参数：
    this.render = function (model) {
        return fn.apply(model);
    };
}
// validator验证方法
function validator(str) {
	if (!str || str === "") {
		return false;
	};
	return true;
} 