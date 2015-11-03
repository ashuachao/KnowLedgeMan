var Draw = {
	
};

Draw.init = function() {
	this.radius = 10;
	this.type = 'draw';
	this.keyDown = 0; //在canvas区域点击的标志
	this.x = 0; //click x
	this.y = 0; //init click y

	var canvas = document.getElementById('palette');
	var cxt = canvas.getContext('2d');
	cxt.fillStyle = '#eee';
	cxt.lineWidth = 1;
	cxt.strokeStyle = '#000';

	this.cxt = cxt;
}

Draw.listen = function() {
	var that = this;
	this.cxt.addEventListener('mousedown', function(e) {
		this.keyDown = 1;
		this.x = e.offsetX;
		this.y = e.offsetY;
		context.moveTo(x, y);
	}, false)
	this.cxt.addEventListener('mouseup', function(e) {
		keyDown = 0;
	}, false)
	this.cxt.addEventListener('mousemove', function(e) {
		if (keyDown && that.type == 'draw') {
			that.x = e.offsetX;
			that.y = e.offsetY;
			that.draw(that.cxt, x, y);
		} else if (keyDown && that.type ==) {
			that.x = e.offsetX;
			that.y = e.offsetY;
			that.eraser(that.cxt, radius, x, y);
		};
	}, false)
}

Draw.draw = function(cxt, x, y) {
	cxt.lineTo(x, y);
	cxt.stroke();
	cxt.moveTo(x, y);

}

Draw.eraser = function(cxt, radius, x, y) {
	cxt.arc(x, y, radius, 0, Math.PI * 2, false);
	cxt.fill();
	cxt.moveTo(x, y);
}