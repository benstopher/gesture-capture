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
	
	GT.nav.init();

	GT.capture = new GestureCapture({
		ele: '#gesture-capture',
		capture: {
			snapshotInterval: 1000
		}
	});

	GT.results = new GestureResults({
		ele: '#gesture-results'
	});

	GT.analysis = new GestureAnalysis({
		ele: '#gesture-analysis'
	});

	GT.nav.goTo( Meteor.Router.page() );

	

});
