var RenderCSV = function( csv, scale  ){
	this.ele = document.createElement('div');
	this.csv = csv;
	this.scale = scale;
	this.hasPoints = false;

	this.parse();


	this.ele.appendChild( this.canvas );

};

RenderCSV.prototype = {
	parse: function(){
		this.bounds = {
			topX: 999999999999,
			topY: 999999999999,
			botX: 0,
			botY: 0
		};

		this.points = [];
		if( this.csv.length > 1 ){
			for( var i = 1; i < this.csv.length; i++ ){
				var x = this.csv[ i ][ 1 ] * this.scale;
				var y = this.csv[ i ][ 2 ] * this.scale;
				if( x < this.bounds.topX ){ 
					this.bounds.topX = x;
				}
				if( y < this.bounds.topY ){ 
					this.bounds.topY = y;
				}
				if( x > this.bounds.botX ){ 
					this.bounds.botX = x; 
				}
				if( y > this.bounds.botY ){ 
					this.bounds.botY = y; 
				}
				this.points.push( new _o.vec( x, y ) );		
				console.log( x, y );
			}
		}

		this.width = this.bounds.botX - this.bounds.topX;
		this.height = this.bounds.botY - this.bounds.topY;
		this.c = _o.createCanvas( this.scale, this.scale );
		this.canvas = this.c.canvas;
		this.ctx = this.c.ctx;
		this.scale = ( this.c.w < this.c.h ) ? this.c.w : this.c.h;
		if( this.points.length > 0){
			this.hasPoints = true;
		}
	},
	render: function( colour ){

		this.colour = colour;
		this.ctx.beginPath();
		for( var i = 0; i < this.points.length; i++ ){
			var point = this.points[i];	
			this.ctx.lineTo( point.x, point.y );		
		}
		var point = this.points[ 0 ];
		this.ctx.lineTo( point.x, point.y );	

		if( typeof this.colour !== 'string' && this.colour.length > 1 ){
			this.ctx.fillStyle = this.createGradient()
		} else {
			this.ctx.fillStyle = this.colour;
		}	
		this.ctx.fill();
	},
	createGradient: function( ){
		var gradient = this.ctx.createLinearGradient( this.bounds.topX, this.bounds.topY, this.bounds.botX, this.bounds.botY );
		for( var i = 0; i < this.colour.length; i++ ){
			gradient.addColorStop( i/this.colour.length, this.colour[i] );
		}
		return gradient;
	}
};