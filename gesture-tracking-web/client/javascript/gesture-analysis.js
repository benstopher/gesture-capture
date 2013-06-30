GestureAnalysis = function( options ){
	var that = this;
	this.options = $.extend({
		ele: null,
		graph: {
			height: 500
		}
	}, options );

	if( this.options.ele ){
		this.$ele = $( this.options.ele );
	} else {
		throw new Error( 'GestureAnalysis requires a container element.' );
	}

	this.init();

};

GestureAnalysis.prototype = {
	init: function( ele ){
		console.log( 'ANALYSIS INIT' );
		var that = this;
		this.speedGraph = {};
		this.speedGraph.$ele = $( '.graph.speed-graph', this.$ele );

		this.distanceGraph = {};
		this.distanceGraph.$ele = $( '.graph.distance-graph', this.$ele );

		this.positionGraph = {};
		this.positionGraph.$ele = $( '.graph.position-graph', this.$ele );

		this.initUI();
	},
	initUI: function(){
		var that = this;
		this.$ele.find('.toggle-analysis').click( function(){
			var $btn = $(this);
			$(this).addClass('loading on')
			that.renderGraphs( function(){
				$btn.removeClass( 'loading on' );
			});
		});
	},
	updateSession: function( sessionID ){
		var id = sessionID || Session.get( "currentTrackingSession" );
		this.session = TrackingSessions.findOne( { _id: id } );
	},
	parseData: function(){
		this.speedGraph.data = [];
		var d = this.session.data;
		var prev = [];
		this.parsed = {
			config: {
				speed: {
					max: 0,
					min: 999999999
				},
				distance: {
					max: 0,
					min: 999999999
				},
				time: {
					max: 0,
					min: 999999999
				},
				timestamp: {
					max: this.session.data[ this.session.data.length - 1].timestamp,
					min: this.session.data[0].timestamp
				}
			},
			left1: [],
			right1: [],
			left2: [],
			right2: []
		};
		for( var i = 0; i < CONF.MarkerNames.length; i++ ){
			var markerName = CONF.MarkerNames[i];
			for( var j = 0; j < this.session.data.length; j++ ){
				var step = this.session.data[ j ];
				var data = step[ markerName ];
				if( data.present ){
					var index = j;
					var x = data.x;
					var y = data.y;
					if( prev[i] ){
						var pX = prev[i].x;
						var pY = prev[i].y;
						var a = x - pX;
						var b = y - pY;
						//analyse
						var dist = Math.sqrt( ( a * a ) + ( b * b ) );
						var time = step.timestamp - prev[i].timestamp;
						var speed = dist / time;
						//save
						if( speed > this.parsed.config.speed.max ){
							this.parsed.config.speed.max = speed;
						}
						if( speed < this.parsed.config.speed.min ){
							this.parsed.config.speed.min = speed;
						}
						if( dist > this.parsed.config.distance.max ){
							this.parsed.config.distance.max = dist;
						}
						if( dist < this.parsed.config.distance.min ){
							this.parsed.config.distance.min = dist;
						}
						if( time > this.parsed.config.time.max ){
							this.parsed.config.time.max = time;
						}
						if( time < this.parsed.config.time.min ){
							this.parsed.config.time.min = time;
						}
						this.parsed[ markerName ].push( {
							timestamp: step.timestamp,
							speed: speed,
							distance: dist,
							time: time,
							angle: 0,
							pos: {
								x: x,
								y: y
							}
						} );
					}
					prev[i] = {
						timestamp: step.timestamp,
						x: x,
						y: y
					}
				}
			}
		}
	},
	renderGraphs: function( callback ){
		this.updateSession();		
		if( this.session ){
			this.parseData();
			this.renderPositionGraph();
			this.renderSpeedGraph();
			this.renderDistanceGraph();
			if( typeof callback === 'function' ){
				callback()
			}
		} else {
			console.log( 'Analysis Cannot render this session: there isn\'t one' );
		}
	},
	renderSpeedGraph: function( ){
		var node = this.speedGraph.$ele;
		var height = this.options.graph.height;
		var width = node.width();
		var svg = d3.select( node[0] )
					.append( 'svg' )
					.attr( 'width', width )
					.attr( 'height', height )

		var graph = svg.append( 'g' );

		var yMax = this.parsed.config.speed.max;
		var yMin = this.parsed.config.speed.min;
		var yScale = d3.scale.linear()
							.domain( [yMax + 0.0005, yMin- 0.0005] )// input range
							.range( [0, height] )// output scale
		var xMax = this.parsed.config.timestamp.max;
		var xMin = this.parsed.config.timestamp.min;
		var xScale = d3.scale.linear()
							.domain( [xMin, xMax] )// input range
							.range( [0, width] )// output scale
		var line = d3.svg.line()
							.x( function( d ){ 					
								return xScale( d.timestamp ); 
							})
							.y( function( d ){
								return yScale( d.speed );
							});
	
		var lines = {};
		for( name in this.parsed ){
			if( name !== 'config' ){
				lines[name] = graph.append('g');
				lines[name].append( 'path' )
					.attr( 'd', line( this.parsed[name] ) )
					.style( 'stroke', function() { 
						return CONF.MarkerInfo[ CONF.MarkerNameToId[name] ].hex;
					})
					.style( 'fill', 'none' )
					.style( 'stroke-width', '2.5' );
			}
		}
	},
	renderDistanceGraph: function( ){
		var node = this.distanceGraph.$ele;
		var height = this.options.graph.height;
		var width = node.width();
		var svg = d3.select( node[0] )
					.append( 'svg' )
					.attr( 'width', width )
					.attr( 'height', height );

		var graph = svg.append( 'g' );

		var yMax = this.parsed.config.distance.max;
		var yMin = this.parsed.config.distance.min;
		var yScale = d3.scale.linear()
							.domain( [yMax + 0.2, yMin - 0.2] )// input range
							.range( [0, height] )// output scale
		var xMax = this.parsed.config.timestamp.max;
		var xMin = this.parsed.config.timestamp.min;
		var xScale = d3.scale.linear()
							.domain( [xMin, xMax] )// input range
							.range( [0, width] )// output scale
		var line = d3.svg.line()
							.x( function( d ){ 					
								return xScale( d.timestamp ); 
							})
							.y( function( d ){
								return yScale( d.distance );
							});
	
		var lines = {};
		for( name in this.parsed ){
			if( name !== 'config' ){
				lines[name] = graph.append('g');
				lines[name].append( 'path' )
					.attr( 'd', line( this.parsed[name] ) )
					.style( 'stroke', function() { 
						return CONF.MarkerInfo[ CONF.MarkerNameToId[name] ].hex;
					})
					.style( 'fill', 'none' )
					.style( 'stroke-width', '2.5' );			
			}
		}
	},
	renderPositionGraph: function( ){
		var node = this.positionGraph.$ele;
		var height = this.options.graph.height;
		var width = node.width();
		var svg = d3.select( node[0] )
					.append( 'svg' )
					.attr( 'width', width )
					.attr( 'height', height );

		var graph = svg.append( 'g' );
		var yScale = d3.scale.linear()
							.domain( [0, 1] )
							.range( [0, height] );
		var xScale = d3.scale.linear()
							.domain( [0, 1] )
							.range( [0, width] );
		var circles = {};
		for( name in this.parsed ){
			if( name !== 'config' ){
				circles[name] = graph.append('g')
									.attr( 'class', name );
				for( var i = 0; i < this.parsed[name].length; i++ ){
						var data = this.parsed[name][i];
						circles[name].append( 'circle' )
							.attr( 'fill', function() { 
								return CONF.MarkerInfo[ CONF.MarkerNameToId[name] ].hex;; 
							})
							.style( 'opacity', 0.2 )
							.attr( 'cx', xScale( data.pos.x ) )
							.attr( 'cy', yScale( data.pos.y ) )
							.attr( 'r', function(){
								return ( data.time/2 > 30 ) ? 30 : data.time/2;
							});
				}
			}
		}

	}
};