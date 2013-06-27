AppNavigator = function( ele ){
	this.ele = ele;
	
};

AppNavigator.prototype = {
	init: function(){
		this.$ele = $( this.ele );
		this.$tabs = $( '.tab', this.$ele );
		this.initUI();
	},
	initUI: function(){
		this.$tabs.click( function( e ){
			e.preventDefault();
			var $toActivate = $(this).closest('.mode'),
				$others = $toActivate.closest('#modes').children('.mode'),
				index = $toActivate.index();

			if( $toActivate.hasClass( 'off' ) ){
				$others.each( function( i ){
					if( i < index && $(this).hasClass('off') ){
						$(this).removeClass('off');
					}
				});
				$toActivate.removeClass('off');
			} else {
				$others.each( function( i ){
					if( i > index && $(this).hasClass('off') === false ){
						$(this).addClass('off');
					}
				});
				$toActivate.addClass('off')
			}
		});
	},
	goTo: function( destination ){
		console.log( 'goto', destination, '#gesture-' + destination, $( '#gesture-' + destination, this.$ele ).closest( '.mode' ).find('.tab') );
		// this.$ele.find( '.mode' ).removeClass( 'current' );
		$( '#gesture-' + destination, this.$ele ).closest( '.mode' ).find('.tab').click();
	}
};