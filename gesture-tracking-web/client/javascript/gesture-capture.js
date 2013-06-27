Template['existing-results'].results = function(){
	console.log( TrackingSessions.find({}).fetch() );
	return TrackingSessions.find({}).fetch();
};

Template['existing-results'].events({
	'click .result-id': function( e ){
		e.preventDefault();
		var id = $( e.target ).attr('href').replace('#result-', '');
		Session.set( "currentTrackingSession", id );
	}
});

GestureCapture = function( options ){
	var that = this;
	this.options = $.extend({
		ele: null,
		analysis: {
			width: 160,
			height: 120
		},
		display: {
			width: 320,
			height: 240
		},
		capture: {
			snapshotInterval: 5000
		}
	}, options );

	if( this.options.ele ){
		this.$ele = $( this.options.ele );
	} else {
		throw new Error( 'GestureCapture requires a container element.' );
	}

	this.init();
	this.createUI();
		
};

GestureCapture.prototype = {
	init: function(){
		var that = this;

		this.isCapturing = false;
		this.isShowMarkers = false;

		this.lastSnapshot = {};
		this.lastData = {};

		this.$videoContainer = $( '.video-container', this.$ele );
		this.$debugContainer = $( '.debug-container', this.$ele );

		this.initCanvas();
		this.initVideo();

	},
	initCanvas: function(){
		this.analysisCanvas = F.createCanvas( this.options.analysis.width , this.options.analysis.height );
		this.displayCanvas = F.createCanvas( this.options.display.width, this.options.display.height );
		if( DEBUG ){
			this.debugCanvas = F.createCanvas( this.options.analysis.width, this.options.analysis.height );
			this.debugCanvas.canvas.id = 'debugCanvas';
		}
	},
	initVideo: function(){
		var that = this;

		this.video = document.createElement( 'video' );
		this.video.width = this.options.display.width;
		this.video.height = this.options.display.height;

		F.getVideoStream( function( stream ){
			that.video.src = window.URL.createObjectURL( stream );
			that.$videoContainer.append( that.video );
			that.$videoContainer.append( that.displayCanvas.canvas );
			if( DEBUG ){
				that.$debugContainer.append( that.debugCanvas.canvas );
			}
			that.initAR();
			that.video.play();
			that.animate();
		});
	},
	initAR: function(){
		this.AR = {
			markers: {},
			markerLifespan: 10,
			threshold: 128,
			markerSize: 120,
			raster: new NyARRgbRaster_Canvas2D( this.analysisCanvas.canvas ),
			param: new FLARParam( this.options.analysis.width, this.options.analysis.height ),
			resultMatrix: new NyARTransMatResult()
		}
		this.AR.detector =  new FLARMultiIdMarkerDetector( this.AR.param, this.AR.markerSize )
		this.AR.detector.setContinueMode( true );
	},
	createUI: function(){
		var that = this;
		this.$toggleCapture = $( '.toggle-capture', this.$ele );
		this.$toggleCapture.click( function(){
			var $this = $(this);
			
			if( !that.isCapturing ){
				$this.addClass( 'loading' );
				that.beginCapture( function(){
					$this.removeClass( 'loading' ).addClass( 'on' )
				});
			} else {
				$this.removeClass( 'on loading' );
				that.endCapture();		
			}
		});
		this.$toggleMarkers = $( '.toggle-markers', this.$ele );
		this.$toggleMarkers.click( function(){
			$(this).toggleClass('on');
			that.isShowMarkers = !that.isShowMarkers;
		});

	},
	updateCollectionData: function(){		
		var that = this;
		TrackingSessions.update( 
			{ _id: this.collectionHandle },
			{
				// $set: this.capture
				$addToSet: { data: that.lastData }
			},
			function( error ){
				if( error ){
					console.log( error );
				}
				//console.log( 'Capture session ' + that.collectionHandle + ' updated - data' );
			}
		);
	},
	updateCollectionSnapshot: function(){		
		var that = this;
		TrackingSessions.update( 
			{ _id: this.collectionHandle },
			{
				// $set: this.capture
				$addToSet: { snapshots: that.lastSnapshot }
			},
			function( error ){
				if( error ){
					console.log( error );
				}
				//console.log( 'Capture session ' + that.collectionHandle + ' updated - snapshot' );
			}
		);
	},
	endCapture: function( ){
		this.updateCollectionData();
		this.updateCollectionSnapshot();
		this.isCapturing = false;
	},
	beginCapture: function( callback ){	
		var that = this;
		//setup our structure for this database entry	
		this.capture = {
			startTime: Date.now(),
			config: {
				snapshotInterval: this.options.capture.snapshotInterval,
				inputRatio: this.options.analysis.height / this.options.analysis.width
			},
			data: [],
			snapshots: []
		};

		// start tracking time for snapshots
		this.lastSnapshotTime = this.capture.startTime;

		//push into the database, receive id / handle
		this.collectionHandle = TrackingSessions.insert( this.capture, function( error ){
			if( error ){
				console.log( error );
			} 

			console.log( 'New capture session inserted: ' + that.collectionHandle );
			
			//set this as a session var, so we can show the currently running capture
			Session.set( "currentTrackingSession", that.collectionHandle );
			
			console.log( Session.get( "currentTrackingSession" ) );

			that.isCapturing = true;
			if( typeof callback === 'function' ){
				callback();
			}
		} );

		
	
	},
	makeSnapshot: function( timestamp ){
		//disabled until we can find a more efficient way
		console.log( 'SNAPSHOT' );
		this.lastSnapshot = {
			timestamp: timestamp,
			imageData: this.displayCanvas.canvas.toDataURL()
			//imageData: '#' // image is disabled, to capture from canvas is too processor intensive
		};
		this.lastSnapshotTime = timestamp;
	},
	videoToCanvas: function(){
		this.analysisCanvas.ctx.drawImage( this.video, 0, 0, this.options.analysis.width, this.options.analysis.height );
		this.displayCanvas.ctx.drawImage( this.video, 0, 0, this.options.display.width, this.options.display.height );
	},
	animate: function(){
		var that = this;
		this.animationFrame = requestAnimationFrame( function(){
			that.animate();
		});
		this.frame();
	},
	frame: function(){
		var ctx = this.displayCanvas.ctx;
		if( this.isShowMarkers ){
			ctx.clearRect( 0, 0, this.displayCanvas.w, this.displayCanvas.h );
		}
		//put our video on the canvas
		this.videoToCanvas();
		//inform AR that it's changed
		this.analysisCanvas.canvas.changed = true;

		//detect markers
		if( this.isCapturing ){
			var currentTimestamp = Date.now();
			var frameTimestamp = currentTimestamp - this.capture.startTime;
			var dataIndex = this.capture.data.length;
			this.lastData = {
				timestamp: frameTimestamp,
				left1: {
					present: false,
					x: null,
					y: null
				},
				right1: {
					present: false,
					x: null,
					y: null
				},
				left2: {
					present: false,
					x: null,
					y: null
				},
				right2: {
					present: false,
					x: null,
					y: null
				}
			};

			var markerCount = this.AR.detector.detectMarkerLite( this.AR.raster, this.AR.threshold );

			// make the image snapshot before we've drawn anything (if we are going to draw anything )
			if( currentTimestamp - this.lastSnapshotTime > this.options.capture.snapshotInterval && markerCount > 0 ){
				this.makeSnapshot( currentTimestamp );
				this.updateCollectionSnapshot();				
			}

			for( var i = 0; i < markerCount; i++ ){
				var marker = this.AR.detector.getIdMarkerData( i ); // get each marker	
				var id = marker.check();							// find the id encoded in it
				var markerAssociation = CONF.MarkerInfo[id].association;
				var corners = [];
				var center = {};
				var square = this.AR.detector.getSquare( i );		// get the bounding info
				square.getCenter2d( center );						// and the center point
				for( var j = 0; j < square.sqvertex.length; j++ ){	// grab each corner out, normalise to 0-1 range
					corners.push( { 
						x: square.sqvertex[j].x / this.options.analysis.width, 
						y: square.sqvertex[j].y / this.options.analysis.height
					} );
				}

				this.AR.markers[id] = {								// save our marker, indexed by id.
					id: id,
					age: 0,
					marker: marker,
					center: center,
					corners: corners
				};
				this.lastData[ markerAssociation ] = {
					present: true,
					x: center.x / this.options.analysis.width, 
					y: center.y / this.options.analysis.height
				};
			}
		}

		// check freshness of markers, remove old ones
		
		for( id in this.AR.markers ){
			var marker = this.AR.markers[ id ];
			marker.age++;
			if( marker.age > this.AR.markerLifespan ){
				delete this.AR.markers[ id ];
			}
		}

		// draw markers
		if( this.isShowMarkers ){
			ctx.lineWidth = '5';
			for( id in this.AR.markers ){
				var marker = this.AR.markers[ id ];
				ctx.strokeStyle = CONF.MarkerInfo[ id ].hex;
				//draw box
				ctx.beginPath();
					for( var i = 0; i < marker.corners.length; i++ ){
						var corner = marker.corners[i];
						ctx.lineTo( corner.x * this.options.display.width, corner.y * this.options.display.height );					
					}
				ctx.closePath();
				ctx.stroke();
			}
		}

		if( this.isCapturing && markerCount > 0 ){
			this.updateCollectionData();
		}

	}
};