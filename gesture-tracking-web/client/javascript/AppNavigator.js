AppNavigator = function( ele ){
	this.$ele = $( ele );
};

AppNavigator.prototype = {
	goTo: function( destination ){
		this.$ele.find( '.mode' ).removeClass( 'current' );
		$( 'gesture-' + destination, this.$ele ).closest( 'mode' ).addClass( 'current' );
	}
};