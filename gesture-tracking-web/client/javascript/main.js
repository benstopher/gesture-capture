//our container for out functions/classes etc.
GT = {
	nav: new AppNavigator( '#modes' )
};

Meteor.Router.add({
	'/'			: 	{ 
		to: 'capture', 
		and: function( id ){
			GT.nav.goTo( 'capture' );
		}
	},
	'/capture'	:	{ 
		to: 'capture', 
		and: function( id ){
			GT.nav.goTo( 'capture' );
		}
	},
	'/results'	: 	{ 
		to: 'results', 
		and: function( id ){
			GT.nav.goTo( 'results' );
		}
	},
	'/analysis'	: 	{ 
		to: 'analysis', 
		and: function( id ){
			GT.nav.goTo( 'analysis' );
		}
	}
});

Meteor.startup( function(){
	
	GT.capture = new GestureCapture({
		ele: '#gesture-capture'
	});

	GT.results = new GestureResults({
		ele: '#gesture-results'
	});

	GT.analysis = new GestureAnalysis({
		ele: '#gesture-analysis'
	});

	GT.nav.goTo( Meteor.Router.page() );

	$('.tab').click( function( e ){
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

});
