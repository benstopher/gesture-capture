GestureResults = function( options ){	
	this.options = $.extend({
		ele: null,
		display: {
			width: 320,
			height: 240
		}
	}, options );

	if( this.options.ele ){
		this.$ele = $( this.options.ele );
	} else {
		throw new Error( 'GestureResults requires a container element.' );
	}

	this.init();

};

GestureResults.prototype = {
	init: function(){
		var that = this;
		this.session = TrackingSessions.findOne( { _id: Session.get( "currentTrackingSession" ) } );
		this.prerenderingCanvasses = {
			left1: F.createCanvas( this.options.display.width, this.options.display.height ),
			right1: F.createCanvas( this.options.display.width, this.options.display.height ),
			left2: F.createCanvas( this.options.display.width, this.options.display.height ),
			right2: F.createCanvas( this.options.display.width, this.options.display.height )
		};		
		this.initUI();
	},
	initUI: function(){
		var that = this;
		this.$ele.find('.toggle-render').click( function(){
			$(this).addClass('loading on')
			that.render();
		});
	},
	updateSession: function( sessionID ){
		var id = sessionID || Session.get( "currentTrackingSession" );
		this.session = TrackingSessions.findOne( { _id: id } );
	},
	dataToShape: function( data, opts ){
		var canvasObj = F.createCanvas( opts.width || 640, opts.height || 480 );
		var ctx = canvasObj.ctx;
		ctx.clearRect( 0, 0, canvasObj.w, canvasObj.h );
		ctx.fillStyle = opts.colour || '#000000';
		ctx.beginPath();
		for( var i = 0; i < data.length; i++ ){
			if( data[i] && data[i].x && data[i].y ){				
				ctx.lineTo( data[i].x * canvasObj.w, data[i].y * canvasObj.h );
			}
		}
		ctx.closePath();
		ctx.fill();

		return canvasObj;

	},
	canvasToImage: function( canvasObj ){
		return canvasObj.canvas.toDataURL();
	},
	makeHumanDateTime: function( timestamp ){
		var date = new Date( timestamp );
		var string = F.zeroPad( date.getDay(), 2); 
		string += '.' + F.zeroPad( date.getMonth(), 2) ;
		string += '.' + date.getFullYear(); 
		string += ' - ' + F.zeroPad( date.getHours(), 2);
		string += ':' + F.zeroPad( date.getMinutes(), 2);
		string += ':' + F.zeroPad( date.getSeconds(), 2);
		string += ':' + F.zeroPad( date.getMilliseconds(), 2);
		return string;
	},
	render: function(){
		var that = this;
		this.updateSession();
		if( this.session ){		
			var templData = {
				title: {
					timestamp: this.session.startTime,
					humanTime: this.makeHumanDateTime( this.session.startTime )
				},
				rows: []
			};			
			var snapshots = this.session.snapshots;
			var allData = this.session.data;
			for( var i = 0; i < snapshots.length; i++ ){			
				(function( snapshot ){
					var snapshotData = [];			
					var thisRow = {
						humanTime: that.makeHumanDateTime( snapshot.timestamp ),
						timestamp: snapshot.timestamp - that.session.startTime,
						snapshot: snapshot.imageData,
						left1: null,
						right1: null,
						left2: null,
						right2: null
					};

					for( var j = 0; j < allData.length; j++ ){	
						if( allData[j].timestamp <= thisRow.timestamp ){
							snapshotData.push( allData[j] );
						} else {
							break;
						}
					}

					for( identifier in that.prerenderingCanvasses ){
						var frameData = _.pluck( snapshotData, identifier );
						var markerID = CONF.MarkerNameToId[ identifier ];
						var markerData = CONF.MarkerInfo[ markerID ];
						thisRow[ identifier ] = that.canvasToImage( 
							that.dataToShape( frameData, {
								colour: markerData.hex
							}) 
						);
					}

					templData.rows.push( thisRow );

				})( this.session.snapshots[i] );				
			}

			this.$ele.empty().append( Template['gesture-results--list']( templData ) );
			this.initUI();

		} else {
			console.log( 'Cannot render this session: there isn\'t one' );
		}
	}
};