// 一个笔记的构造器
function Note(title, content, catagory, type, id) {
	this.addCata = $(".add-catalog"); //分类增加按钮
	this.delCate = $(".del-catalog")  //分类删除按钮
	this.addnote = $(".add-note");	//笔记增加按钮
	this.delnote = $(".del-note");	//笔记删除按钮
	//catalog列表 找寻里面的 span(cata) span(count)
	this.catalog = $(".catalog");
	// note列表 寻找里面的 h5 和 p
	this.note_list = $(".note-list-item");
	// note内容 找到里面的header 和content
	this.note_content = $(".note-content");
	this.cataInput = $(".catalog span input"); 
	this.dialog = $(".dialog");
	this.mask = $('.mask');
	this.confirm = $(".Aconfirm")

	this.title = title;
	this.type = type;
	this.content = content;
	this.category = category || '未分类';
	this.createAt = (new Date()).toString();
	this.id = id;
}

Note.prototype.init = function(userSetting) {
	this.contextmenu();
	this.clickAddCata();
	this.clickDelCata();
	this.handleCatalog();
	this.clickAddNote();
	this.handleNote();
	this.clickDelNote();
}

//右键自定义菜单
Note.prototype.contextmenu = function() {
	// 获取的是鼠标每次点击的坐标的一个对象
	document.oncontextmenu = function(ev) {
		var oEvent = ev || window.event;
		var menu = $(".context-menu");
		var change = "{display:block;left:" + oEvent.clientX + "px;top:"+ oEvent.clientY + "px}";
		menu.cssText = change;
		return false; //阻止默认行为
	}
}
//增加分类按钮
Note.prototype.clickAddCata = function() {
	function createInput() {
		var Input = document.createElement('input');
		Input.type = "text";
		Input.value = "请输入你的分类";
		Input.className = 'inputSet';
	}
	var that = this;
	// 获取模板内容
	var catalogInput = new Template("\""+$("#cInput").innerHTML+"\"");
	this.addCata.onclick = function(ev) {
		ev.preventDefault();
		
		var Input = createInput();

		// 在cata列表中加入一个输入框用于输入列表名字
		that.catalog.appendChild(Input);
		
		var inputD = that.catalog.getElementsByTagName('input')[0];
		
		inputD.focus();
		
		addEvent(inputD,"blur",function(ev) {
			ev = ev || window.event;
			// 获取到是哪一个cata失去焦点
			var target = ev.target || ev.srcElement;
			// 获取到输入的value
			var inputValue = target.value;
			//验证输入是否为空或者有其他不合法字符
			if (validator(inputValue)) {
				inputValue = "" + inputValue;
				//检查本地储存有没有这个分类
				if (!Storage.getNoteBook(inputValue)) {
					// 在本地储存增加分类
					Storage.addNoteBook(inputValue);
					// that.cata[inputValue].count = 0;
					
					// 移除了这个input框
					that.catalog.removeChild(Input);
					// 替换模板内容
					var realCata = catalogInput.render({
						// count:that.cata[inputValue].count,
						cata:Storage.getNoteBook(inputValue);
					});
					trim(realCata);
					// 替换模板便利
					realCata = realCata.replace(/\"/g,"");
					var li = document.createElement('li');
					li.innerHTML = realCata;
					that.catalog.appendChild(li);
					that.handleCatalog();

				}else { //如果已经有了这个属性 
					target.focus();
					target.value = '请重新输入[已存在]';
				}
			
			}
		})
		return false; //阻止跳转
	}
}


//删除分类按钮
Note.prototype.clickDelCata = function() {
	var that = this;
	this.delCate.onclick = function(ev) {
		ev.preventDefault();
		var cata = that.catalog.getElementsByTagName("li");
		for(var i=0,l=cata.length;i<l;i++) {
			if (cata[i].className == 'cataHover') {
				//获取目标li的名字
				var tarvalue = cata[i].getElementsByTagName('span')[0].innerHTML;
				tarvalue = ""+ tarvalue;
				that.catalog.removeChild(cata[i]);
				//清空原来属于tarvalue的内容
				
				Storage.deleteNoteBook(tarvalue);
			};	
		}
		return false;
	}
}

//点击分类
Note.prototype.handleCatalog = function() {
	var that = this;
	var cata = this.catalog.getElementsByTagName("li");
	
	for(var i=0,l=cata.length;i<l;i++) {
		
		addEvent(cata[i],"click",function(ev) {
			// 遍历一遍先清除默认样式
			var catalogList = that.catalog.getElementsByTagName("li");
			for (var i=0,len=catalogList.length;i<len;i++) {
				removeClass(catalogList[i],"cataHover");
			}
			addClass(this,"cataHover");
			var cata = this.getElementsByTagName('span')[0];
			var value = cata.innerHTML;
			var NoteList = Storage.getNoteList(value);

			for (var i=0; i<NoteList.length; i++) {
				//show cata[value]里面的内容
				
					that.showNote(NoteList[i].id);
			}
		});
	}
}

//笔记的添加
Note.prototype.clickAddNote = function() {
	var that = this;
	
	var nconfirm = $(".dialog .dialog-btn .confirm");
	var ncancel = $(".dialog .dialog-btn .cancel");
	
	addEvent(that.addnote,'click',function(ev) {
		ev.preventDefault();
		that.createMask();
		that.createDialog();
		return false;
	});
	addEvent(nconfirm,'click',function() {
		var contentR = $(".dialog .contentR").value;
		var headerR = $(".dialog .header").value;
		// 获得现在的note目录 笔记的题目和内容
		var cataName = $(".cataHover .cata").innerHTML;
		var note = $(".cataHover .cata").innerHTML;
		var current = {
			content:contentR,
			title:headerR,
			category:cataName;
			type:"write";
			id:headerR;
			createAt:(new Date()).toString();
		}
		Storage.storeNote(current);
			// if (!that.cata[cataName][headerR]) {
			// 	that.cata[cataName][headerR] = {};
			// 	that.cata[cataName][headerR].headerR = headerR;
			// 	that.cata[cataName][headerR].contentR = contentR;
			// 	that.cata[cataName].count ++;
			// 	that.delMask();
			// 	that.delDialog();
			// 	that.showNote(note,headerR);
			// }else {
			// 	$(".dialog .header").focus();
			// 	$(".dialog .header").value = '已经有这个题目了，请换一个';
			// }
	});
	addEvent(ncancel,'click',function() {
		// 这里可以考虑把内容缓存起来
		that.delMask();
		that.delDialog();
	})
}
//笔记的显示
Note.prototype.showNote = function(id) {
	// 获得模板内容
	var that = this;
	var nInput = new Template($('#nInput').innerHTML);
	var note = Storage.getNote(id);
	var realNote = nInput.render({
		header:note.title,
		content:note.content
	});
	var li = document.createElement('li');
	li.innerHTML = realNote;
	this.note_list.appendChild(li);
	this.handleNote();
}
// 笔记的操作
Note.prototype.handleNote = function() {
	var that = this;
	var listItem = this.note_list.getElementsByTagName("li");
	for (var i=0,len=listItem.length;i<len;i++) {
		addEvent(listItem[i],"click",function(ev) {
			// 先移除所有li中的noteHover样式
			for (var j=0;j<len;j++) {
				removeClass(listItem[j],"noteHover");
			}
			addClass(this,"noteHover");
			// 获取现在focus的对象
			var cata = $(".cataHover .cata").innerHTML;
			var headerR = this.getElementsByTagName("h5")[0].innerHTML;
			var note = Storage.getNote(headerR);
			that.showNoteContent(note);
		})
	}
}
// 笔记内容的显示
Note.prototype.showNoteContent = function(note) {
	var noteContentHeader = $(".note-content .note-contentHeader .note-title");
	var noteContentR = $(".note-content .note-contentR");
	var realHeader = note.title;
	var realContent = note.content;
	noteContentHeader.innerHTML = realHeader;
	noteContentR.innerHTML = realContent;
}
// 创建一个dialog弹窗
Note.prototype.createDialog = function() {
	// this.dialog.style.left = (document.body.clientWidth - this.dialog.offsetWidth)/2 + 'px';
	// this.dialog.style.top = (document.body.clientHeight - this.dialog.offsetHeight)/2 + 'px';
	this.dialog.style.display = 'block';
}
// 删除一个dialog弹窗
Note.prototype.delDialog = function() {
	this.dialog.style.display = 'none';
}

// 创建一个Mask遮罩
Note.prototype.createMask = function() {
	this.mask.style.display = 'block';
}
// 删除Mask遮罩
Note.prototype.delMask = function() {
	this.mask.style.display = 'none';
}

// 笔记的删除
Note.prototype.clickDelNote = function() {
	var that = this;
	addEvent(that.delnote,'click',function() {
		that.createMask();
	//创建一个确认框	
		that.createConfirm();
	//对确认框的操作	
		that.handlerConfirm();
	})
}
// 确认框的创建
Note.prototype.createConfirm = function() {
	this.confirm.style.display = 'block';
}
// 删除确认框
Note.prototype.delConfirm = function() {
	this.confirm.style.display = 'none';
}
// 确认框的操作
Note.prototype.handlerConfirm = function() {
	var that = this;
	var categoryName = $('.cataHover .cata').innerHTML;
	var noteName = $('.note-content .note-contentHeader .note-title').innerHTML;
	
	var noteList = Storage.getNoteList(categoryName);

	var sure = $(".confirmB .Bconfirm");
	var nSure = $(".confirmB .Bcancel");
	
	addEvent(sure,'click',function() {
		that.delMask();
		that.delConfirm();

		if (noteList) {
			var ls = noteList.split('&');
			if (ls.indexOf(noteName) == -1) {
				noteList = noteName + "&" + noteList;
				localStorage.setItem('notebook_' + categoryName, noteList)
			}
		} else {
			localStorage.setItem('notebook_' + categoryName, noteName);
		}
		//重新渲染一次 
		that.render(categoryName);
	});
	addEvent(nSure,'click',function() {
		that.delMask();
		that.delConfirm();
	})
}
// Note的渲染
Note.prototype.render = function(category) {
	// render cata_list行
	// render node_list
	var note = Storage.getNoteList(category);
	for (var i=0; i<note.length; i++) {

			this.showNoteContent(note[i]);

	}

}

var note = new Note();
var Storage = new Storage();
Storage.init();
note.init();


