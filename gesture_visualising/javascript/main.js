var renderer = new RenderCSV( document.querySelector( '#show' ) );

var load = new LoadCSV( document.querySelector( '#pick-csv' ), document.querySelector( '#csv-list' ), function( files ){
	document.querySelector( '#load' ).classList.add( 'hidden' );
	document.querySelector( '#show' ).classList.remove( 'hidden' );
	
	renderer.render( files[0].contents );

});
