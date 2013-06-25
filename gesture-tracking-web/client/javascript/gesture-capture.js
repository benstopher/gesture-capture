DEBUG = true;

GestureCapture = function( options ){
	var that = this;
	this.options = $.extend({
		ele: null,
		analysis: {
			width: 320,
			height: 240
		},
		display: {
			width: 640,
			height: 480
		}
	}, options );

	if( this.options.ele ){
		this.$ele = $( this.options.ele );
	} else {
		throw new Error( 'Gesture Capture requires a container element.' );
	}

	this.init();
	this.createUI();
		
};

GestureCapture.prototype = {
	init: function(){
		var that = this;	

		this.$videoContainer = $( '.video-container', this.$ele );

		this.analysisCanvas = F.createCanvas( this.options.analysis.width , this.options.analysis.height );
		this.displayCanvas = F.createCanvas( this.options.display.width, this.options.display.height );
		if( DEBUG ){
			this.debugCanvas = F.createCanvas( this.options.display.width, this.options.display.height );
			this.debugCanvas.canvas.id = 'debugCanvas';
		}
		
		this.video = document.createElement( 'video' );
		this.video.width = this.options.display.width;
		this.video.height = this.options.display.height;

		F.getVideoStream( function( stream ){
			that.video.src = window.URL.createObjectURL( stream );
			that.$videoContainer.append( that.video );
			that.$videoContainer.append( that.displayCanvas.canvas );
			if( DEBUG ){
				that.$videoContainer.append( that.debugCanvas.canvas );
			}
			that.initAR();
			that.video.play();
			that.animate();
		});

	},
	initAR: function(){
		this.AR = {
			threshold: 128,
			markerSize: 120,
			raster: new NyARRgbRaster_Canvas2D( this.analysisCanvas.canvas ),
			param: new FLARParam( this.options.analysis.width, this.options.analysis.height )			
		}
		this.AR.detector =  new FLARMultiIdMarkerDetector( this.AR.param, this.AR.markerSize )
		this.AR.detector.setContinueMode( true );
	},
	createUI: function(){

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
		this.videoToCanvas();

		this.analysisCanvas.canvas.changed = true;

		var markerCount = this.AR.detector.detectMarkerLite( this.AR.raster, this.AR.threshold );

		console.log( markerCount );

	}
};