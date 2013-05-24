var LoadCSV = function( input, list, onRead ){
	var that = this;
	this.fileInput = input;
	this.fileList = list;
	this.fileInput.addEventListener( 'change', function( e ){ that.handleSelectedFiles( e ) }, false );
	this.files = [];
	if( typeof onRead === 'function' ){
		this.callback = function( f ){
			onRead( f );
		}
	}
};

LoadCSV.prototype ={
	handleSelectedFiles: function( event ){
		var that = this;
		var selectedFiles = event.target.files;
		var toReadCount = 0;
		var readCount = 0;
		if( selectedFiles.length > 0 ){
			for( var i = 0; i < selectedFiles.length; i++ ){
				var file = selectedFiles[ i ];
				if( file.type === 'text/csv' ){
					toReadCount++;
					var reader = new FileReader();
      				reader.onload = ( function( thisFile ){
						return function(e) {
							that.files.push({
								'name': thisFile.name,
								'contents': CSV.parse( e.target.result )
							});
							readCount++;
							if( readCount === toReadCount ){
								that.callback( that.files );
							}
						}
					})( file );
					reader.readAsText( file );
				}
			}
		}
	}
};