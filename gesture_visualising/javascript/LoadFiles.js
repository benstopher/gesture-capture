var LoadFiles = function( input, list, onRead ){
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

LoadFiles.prototype ={
	wipe: function(){
		this.files = [];
	},
	handleSelectedFiles: function( event ){
		var that = this;
		var selectedFiles = event.target.files;
		var toReadCount = 0;
		var readCount = 0;
		if( selectedFiles.length > 0 ){
			for( var i = 0; i < selectedFiles.length; i++ ){
				var file = selectedFiles[ i ];
				if( file.type === 'text/csv' || file.type === 'image/png' || file.type === 'image/jpeg'){
					toReadCount++;
					var reader = new FileReader();
      				reader.onload = ( function( thisFile ){
						return function(e) {
							if( thisFile.type === 'text/csv' ){
								that.files.push({
									'type': 'csv',
									'name': thisFile.name,
									'contents': CSV.parse( e.target.result )
								});
							} else {
								that.files.push({
									'type': 'img',
									'name': thisFile.name,
									'contents': e.target.result
								});
							}
							readCount++;
							if( readCount === toReadCount ){
								that.callback( that.files );
								that.wipe();
							}
						}
					})( file );
					reader.readAsText( file );
				}
			}
		}
	}
};