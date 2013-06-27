F = {};

F.zeroPad = function( string, desiredLength ){
	var string = string.toString();
	var zeroes = '';
	for( var i = 0; i < desiredLength; i++ ){
		zeroes += '0';
	}
	return ( zeroes + string ).substr( desiredLength * -1 );
}

F.createCanvas = function( width, height ){
	var canvas = {};

	canvas.canvas			=	document.createElement( 'canvas' );
	canvas.canvas.width		=	width || window.innerWidth;
	canvas.canvas.height	=	height || window.innerHeight;
	canvas.w				=	canvas.canvas.width;
	canvas.h				=	canvas.canvas.height;
	canvas.ctx				=	canvas.canvas.getContext( '2d' );

	// bind a listener to resize with window, 
	// but only if size hasn't been set explicitly
	if( !width && !height ){
		window.addEventListener('resize', function() {
			_o.resizeCanvas( canvas, window.innerWidth, window.innerHeight );
		});
	}

	return canvas;
}

F.getVideoStream = function( callback ){
	console.log( 'getting video ');
	navigator.gUM( //we use our shim-ed version of getUserMedia (see libs/shims-shivs.js )
		{
			video: true,
			audio: false
		},
		function( stream ){ //success
			console.log( 'success' )
			if( typeof callback === 'function' ){
				console.log( 'callback' );
				callback( stream );
			}
		},
		function( error ){ //error
			console.log( 'GetUserMedia error occurred: ' + error );
		}
	); 
};