Meteor.startup(function () {
	// code to run on server at startup
});

Meteor.methods({
	emptyAllData: function( opts ){ //clear our data
		//WARNING: clears everything out indiscriminately... (please close this, it's a massive security hole)
		if( opts.really === true ){ //lame security: pass in really: true otherwise it won't delete a thing
			TrackingSessions.remove({}, function(){
				if( typeof opts.callback === 'function' )
					opts.callback();	
			});		
		}	
	}
});