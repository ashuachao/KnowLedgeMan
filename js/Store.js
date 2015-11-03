var Storage = {};

Storage.storeNote = function(note) {
	var noteId = '';
	// 获得所有笔记的列表
	var NoteList = this.getNoteList();
	if (note.id) { //如果救就笔记
		noteId = note.id;
		var noteInfo = this.getNote(note.id);
		var oldCategory = noteInfo.category;
		if (oldCategory !== note.category) { //分类不一样的化
			this.removeNoteFromCategory(note.id, oldCategory);
			this.addNoteToCategory(note.id, note.category);
		}
		for (var i=0; i<NoteList.length; i++) {
			if (NoteList[i].id === note.id) {
				NoteList[i].category = note.category;
				NoteList[i].title = note.title;
			};
		}
		localStorage.setItem('note_' + note.id, JSON.stringify(note));
	} else {
		note.id = (new Date()).valueOf();
		noteId = note.id;
		localStorage.setItem('note_' + note.id, JSON.stringify(note));

		NoteList.push({
			content:note.content,
			title:note.title,
			category:note.category;
			type:note.type;
			id:note.id;
			createAt:note.createTime;
		})
		this.storeNoteList(NoteList);
		return noteId;
	}
}

// 存储所有笔记的列表
Storage.storeNoteList = function(list) { 
	localStorage.setItem('noteList', JSON.stringify(list));
}


// 获得所有笔记
Storage.getNoteList = function(category) {
	var list = [],
		notes;
	if (!!category) {
		// 获得一个分类下的所有笔记
		notes = localStorage.getItem('notebook_' + category);
		if (notes) {
			list = JSON.parse(notes);
		}
	} else {
		// 获得所有笔记
		notes = localStorage.getItem('noteList');
		if (notes) {
			list = JSON.parse(notes);
		}
	}
	return list;
}

Storage.getNote = function(id) {
	var json = location.getItem('note_' + id);
	var note;
	if (json) {
		note = JSON.parse(json);
	} else {
		note = null;
	}
	return note;
}

// 获得笔记内容
Storage.getNoteContent = function(id) {
	var note = this.getNote(id);
	return note.content;
}

// 获得分类笔记
Storage.getNoteCategory = function(id) {
	var note = this.getNote(id);
	return note.category;
}

// 删除笔记
Storage.deleteNote = function(id) {
	var note = this.getNote(id),
		noteList = this.getNoteList();

	if (noteList && noteList != []) {
		for (var i=0; i<noteList.length; i++) {
			if (noteList[i].id == id) {
				break;
			};
		}
		noteList.splice(i, 1);
		this.storeNoteList(noteList);

		var categoryList = this.getNoteList(note.category);
		for(i=0; i<categorylist.length; i++){
			if(categorylist[i]==id){
				break;
			}
		}
		categorylist.splice(i,1);
		// 从分类中删除日记
		Storage.storeCategory(note.category,categorylist);
		localStorage.removeItem('note_'+id);
 	};
}

// 获得分类
Storage.addNoteBook = function(category) {
	var notebooks = this.getNoteBookList();
	if (notebooks.indexOf(category) == -1) {
		notebooks.push(category);
		localStorage.setItem('notebook', JSON.stringify(notebooks));
	};
}


Storage.getNoteBookList = function() {
	var notebookList = localStorage.getItem('notebook');
	if (notebookList) {
		return JSON.parse(notebookList);
	} else {
		return [];
	}
}

// 把笔记加入分类
Storage.addNoteToCategory = function(id, category) {
	// 获得这个分类的Note
	var list = this.getNoteList(category);
	list.push(id);
	localStorage.setItem('notebook_'+ category, JSON.stringify(list));
	// 获得分类列表
	var categories = this.getCategoryList();
	if (!categories) {
		categories = [];
		categories.push(category);
	} else {
		var index = categories.indexOf(category);
		if (index == -1) {
			categories.push(category);
		}
	}
	localStorage.setItem('notebook', JSON.stringify(categories));
}

Storage.removeNoteFromCategory = function(id, category) {
	var list = this.getNoteList(category);
	if (list) {
		for (var i=0; i<list.length; i++) {
			if(list[i] == id) {
				break;
			}
		}
		if (i !== list.length) {
			list.splice(i, 1);
		}
		localStorage.setItem('notebook_' + category, JSON.stringify(list));
	}
}

Storage.getCategoryList = function() {
	var list = localStorage.getItem('notebook');
	if (list) {
		return JSON.parse(list);
	} else {
		return [];
	}
}

Storage.storeCategoryList = function(list) {
	localStorage.setItem('notebook', JSON.stringify(list));
}
// 储存分类
Storage.storeCategory = function(category, list) {
	localStorage.setItem('notebook_' + category, JSON.stringify(list));
}
// 删除什么的分类
Storage.deleteNoteBook = function(category) {
	var noteList = Storage.getNoteList(category);
	var categories = Storage.getCategoryList();
	var index = categories.indexOf(category);

	if (index !== -1) {
		categories.splice(i, 1);
		this.storeCategoryList(categories);
	}

	//move note into default note category
	var defaultCategoryList = this.getNoteList('notebook_未分类') || [];
	noteList.forEach(function(id, index) {
		var note = Storage.getNote(id);
		note.category = '未分类';
		Storage.storeNote(note);
		defaultCategoryList.push(id);
	});
	this.storeCategory('未分类', defaultCategoryList);
}

Storage.renameNoteBook = function(oldCategory, newCatagory) {
	var categories = this.getCategoryList();
	var index = categories.indexOf(oldCategory);
	if (index !== -1) {
		categories.splice(i, 1, newCatagory);
	} else {
		categories.push(newCatagory);
	}
	this.storeCategoryList(categories);
	var notes = this.getNoteList();
	if (notes) {
		for (var i = 0; i < notes.length; i++) {
			if(notes[i].category == oldCategory) {
				notes[i].category = newCatagory;
			}
		}
	}
	this.storeNoteList(notes);

	notes = this.getNoteList(oldCategory);
	localStorage.removeItem('notebook_' + oldCategory);
	var newCatagoryNotes = localStorage.getItem(newCatagory);
	notes.forEach(function(id) {
		var note = Storage.getNote(id);
		note.category = newCatagory;
		Storage.storeNote(note);
	});

	if(newCatagoryNotes) {
		var list = JSON.parse(newCatagoryNotes);
		notes.forEach(function(item) {
			list.push(item);
		});
		Storage.storeCategory(newCatagory, list);
	} else {
		Storage.storeCategory(newCatagory, notes);
	}
}

Storage.init = function() {
	if (Storage.getNoteList().length === 0) {
		var content = "It's a beautiful world";
		var title = "demo";
		var category = "chan";
		var note = new Note(title, content, category,'text');
		Storage.storeNote(note);
}