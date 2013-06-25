var colors = [
	['rgba(244, 166, 52, 0.9)', 'rgba(244, 166, 52, 0.6)'],
	['rgba(44, 221, 166, 0.9 )', 'rgba(44, 221, 166, 0.6 )'], 
	['rgba(219, 131, 116, 0.9)', 'rgba(219, 131, 116, 0.6)'],
	['rgba(131, 116, 219, 0.9)', 'rgba(131, 116, 219, 0.6)']
];

var show = document.getElementById( 'show' );
var scale = 400;

var ul = document.createElement( 'ul' );

var rows = [];

var showRendered = function(){
	show.classList.remove('hidden');
}

var renderRow = function( row ){
	rows.push( row );	
	var li = document.createElement( 'li' );
	for( var j = 0; j < row.length; j++ ){
		console.log( row[j] );
		li.appendChild( row[j] );
	}
	ul.appendChild( li );
	
	show.appendChild( ul );
	
	showRendered();
	//load

}

var receiveFiles = function( files ){
	var row = [];
	var renderers = [];
	var images = []
	for( var i = 0; i < files.length; i++ ){
		if( files[i].type === 'csv' ){
			console.log('csv');
			var renderer = new RenderCSV( files[i].contents, window.innerWidth * 0.15 );	
			renderers.push( renderer );
		} else if( files[i].type === 'img' ){
			var image = document.createElement( 'img' );
			image.src = files[i].contents;
			images.push( image );
		}
	}

	for( var i = 0; i < renderers.length; i++ ){
		var renderer = renderers[i];
		var colorIndex = (i+1) % colors.length;
		if( renderer.hasPoints ){
			renderer.render( colors[ colorIndex ] );	
		}
		row.push( renderer.ele );		
	}
	for( var i = 0; i < images.length; i++ ){
		var image = images[i];		
		row.push( image );		
	}
	
	console.log( 'render rows' );
	renderRow( row );
	// load = new LoadFiles( document.querySelector( '#pick-csv' ), document.querySelector( '#csv-list' ), function( files ){
	// 	receiveFiles( files );
	// });
};

var load = new LoadFiles( document.querySelector( '#pick-csv' ), document.querySelector( '#csv-list' ), function( files ){
	receiveFiles( files );
});
