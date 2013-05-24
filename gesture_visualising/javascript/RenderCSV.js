var RenderCSV = function( ele ){
	this.ele = ele;
	this.c = _o.createCanvas();
	this.canvas = this.c.canvas;
	this.ctx = this.c.ctx;
	this.scale = ( this.c.w > this.c.h ) ? this.c.w : this.c.h;

	this.ele.appendChild( this.canvas );

};

RenderCSV.prototype = {
	parse: function( csv ){
		var header = csv[ 0 ];
	},
	render: function( csv ){
		this.ctx.beginPath();
		for( var i = 1; i < csv.length; i++ ){
			var x = csv[ i ][ 1 ] * this.scale;
			var y = csv[ i ][ 2 ] * this.scale;
			this.ctx.lineTo( x, y );			
		}
		this.ctx.stroke();
	}
};