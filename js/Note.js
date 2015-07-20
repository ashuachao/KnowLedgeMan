// 一个笔记的构造器
function Note() {
	this.addCata = $(".add-catalog");
	this.delCate = $(".del-catalog")
	this.addnote = $(".add-note");
	this.delnote = $(".del-note");
	//catalog列表 找寻里面的 li
	this.catalog = $(".catalog");
	// note列表 寻找里面的 h5 和 p
	this.note_list = $(".note-list-item");
	this.note_content = $(".note-content");
	this.cataInput = $(".catalog input"); 
}

Note.prototype.init = function(userSetting) {

}
//增加分类按钮
Note.prototype.clickAddCata = function() {
	var catalogInput = "<li><input value='请输入你的分类' type='text'/></li>";
	this.addCata.onclick = function() {
		this.catalog.appendChild(catalogInput);
		this.catalogInput.focus();
		addEvent(this.catalog,"blur",function(ev) {
			var target = ev.target || ev.srcElement;
			var input = target.getDocumentByTag("input");
			var inputvalue = input.value;
			//验证输入是否为空或者有其他不合法字符
			if (validator(inputvalue)) {
				//检查对象的note_list属性是否有inputValue属性 没有就定义一个
				if (!this.note_list[inputvalue]) {
					this.note_list[inputvalue] = {};
				}
				target.removeChild("input");
				target.innerHTML(inputvalue);
			}
		})
	}
}
//删除分类按钮
Note.prototype.clickDelCata = function() {
	this.delCate.onclick = function() {
		addEvent(this.catalog,"focus",function(ev) {
			var target = ev.target || ev.srcElement;
			//获取目标li的名字
			var tarvalue = target.innerHTML;
			this.catalog.removeChild(target);
			//清空原来属于tarvalue的内容
			this.note_list[tarvalue] = {};
		})
	}
}
//右键自定义菜单
Note.prototype.contextmenu = function() {

}
//点击分类
Note.prototype.handleCatalog = function() {
	addEvent(this.catalog,"click",function(ev) {
		var catalogList = this.catalog.getElementByTagName("li");
		for (var i=0,len= catalogList.length;i<len;i++) {
			removeClass(catalogList[i],"cataHover");
		}
		var target = ev.target || ev.srcElement;
		addClass(target,"cataHover");
		var value = target.innerHTML;
		for (var i in this.note_list[value]) {
			//show note_list[value]里面的内容
			this.showNote(,value,i);
		}
	})；
}
//笔记的显示
Note.prototype.showNote = function(value,header) {
	var note = "<li><h5>"+this.note_list[value][header].headerR+"</h5><p>"+this.note_list[value][header].contentR+"</p>";
	this.note_list.appendChild(note);
}
//笔记的添加
Note.prototype.clickAddNote = function() {
	this.createMask();
	this.createDialog();
	// 获得现在的note目录 笔记的题目和内容
	var note = $("noteHover").innerHTML;
	var headerR = $(".dialog .header").value;
	var contentR = $(".dialog .contentR").value;
	// 如果没有这个对象 创建一个对象属性 是属于note_list下note的headerR属性
	if (!this.note_list[note][headerR]) {
		this.note_list[note][headerR] = {};
	}
	this.note_list[note][headerR]headerR = headerR;
	this.note_list[note][headerR]contentR = contentR;
	showNote(note,headerR);
}
// 笔记的操作
Note.prototype.handleNote = function() {
	addEvent(this.note_list,"click",function(ev) {
		var target = ev.target || ev.srcElement;
		var listItem = this.note_list.getElementByTagName("li");
		for (var i=0,len=listItem.length;i<len;i++) {
			removeClass(listItem[i],"noteHover");
		}
		addClass(target,"noteHover");
		// 获取现在focus的对象
		var note = getByClass(this.catalog,"cataHover");
		var headerR = target.getDocumentByTag("h5").innerHTML;
		showNoteContent(headerR);
	})
}
// 笔记内容的显示
Note.prototype.showNoteContent = function(value,headerR) {
	var noteContentHeader = getByClass(this.note_content,"note-title");
	var noteContentR = getByClass(this.note_content,"note-contentR");
	var realHeader = this.note_list[value][headerR].headerR;
	var readContent = this.note_list[value][headerR].contentR;
	noteContentHeader.innerHTML = realHeader;
	noteContentR.innerHTML = readContent;
}