import java.io.*;  // for the loadPatternFilenames() function
import java.util.Date; // for timestamps
import processing.video.*;
import jp.nyatla.nyar4psg.*; //marker tracking and analysis

long startTimestamp;

String savePath;
String camPara;
String patternPath;

// the dimensions at which the AR will take place.
int arWidth = 640;
int arHeight = 480;
int numMarkers = 4; //how many patterns to track?

int[] clrs;

Capture cam;

MultiMarker nya;

ArrayList[] markerPoints;
ArrayList[] markerTimes;

boolean showPaths = false;

void setup(){
	size( 640, 480, OPENGL );

	Date date = new Date();
	startTimestamp = date.getTime();	

	savePath = dataPath( "results/" + startTimestamp + "/");
	camPara = sketchPath("inc/camera_para.dat");
	patternPath = dataPath("patterns/patt");

	println( savePath );	
	
	cam = new Capture( this, 640, 480 );
	cam.start();

	nya = new MultiMarker( this, arWidth, arHeight, camPara, NyAR4PsgConfig.CONFIG_DEFAULT );
	nya.setLostDelay( 1 ); //delay until lost marker is hidden - set v low here

	String[] patterns = loadPatternFilenames( patternPath ) ;	
	for( int i = 0; i < numMarkers; i++ ){
		nya.addARMarker( patternPath + "/" + patterns[i], 80 );
	}

	markerPoints = new ArrayList[ numMarkers ];	
	for( int i = 0; i < markerPoints.length; i++ ){
		markerPoints[i] = new ArrayList();
	}
	markerTimes = new ArrayList[ numMarkers ];
	for( int i = 0; i < markerPoints.length; i++ ){
		markerTimes[i] = new ArrayList();
	}

	clrs = new int[ numMarkers ];	
	if( numMarkers > 0 ){
		clrs[ 0 ] = color( 255, 0, 0 );
		clrs[ 1 ] = color( 0, 255, 0 );
	}
	if( numMarkers > 2 ){
		clrs[ 2 ] = color( 0, 0, 255 );
		clrs[ 3 ] = color( 255, 255, 0 );
	}

}

void draw(){
	if( cam.available() ){
		cam.read();

		Date d = new Date();
		long currentTimestamp = d.getTime();
		long frameStamp = currentTimestamp - startTimestamp;
		
		PImage scaledFrameToAr = createImage( arWidth, arHeight, RGB );
		scaledFrameToAr.copy( cam, 0, 0, cam.width, cam.height, 0, 0, arWidth, arHeight );
		scaledFrameToAr.resize( arWidth, arHeight );

		background( 0 );
		fill( 255 );
		stroke( 255, 0 ,0 );
		nya.detect( scaledFrameToAr );

		//flip/mirror
		pushMatrix();
		scale( -1, 1 );
		translate( -width, 0, 0 );		

		for( int i = 0; i < numMarkers; i++ ){
			if( nya.isExistMarker(i) ){	
				PVector[] corners = nya.getMarkerVertex2D( i );
				markerPoints[ i ].add( new PVector( corners[0].x, corners[0].y, corners[0].z ) );
				markerTimes[ i ].add( frameStamp );

				beginShape();
					for( int j = 0; j < corners.length; j++ ){
						vertex( corners[j].x, corners[j].y );
					}
				endShape();

			}
		}

		popMatrix(); //unflip/unmirror
	}

	if( showPaths ){
		background( 0 );
		strokeWeight( 5 );
		//flip/mirror
		pushMatrix();
		scale( -1, 1 );
		translate( -width, 0, 0 );
		for( int i = 0; i < markerPoints.length; i++ ){
			ArrayList points = markerPoints[i];
			stroke( clrs[i] );
			for( int j = 1; j < points.size(); j++ ){
				PVector here = (PVector) points.get( j - 1);
				PVector there = (PVector) points.get( j );
				line( here.x, here.y, there.x, there.y );
			}
		}
		popMatrix(); //unflip/unmirror
	}
}

void keyPressed(){
	if( key == ' ' ){
		showPaths = !showPaths;
	}
	if( key == 'i' ){
		saveFrame();
	}
	if( key == 's' ){
		saveFiles();
	}
}

void saveFiles(){
	for( int i = 0; i < markerPoints.length; i++ ){
		ArrayList points = markerPoints[i];
		ArrayList times = markerTimes[i];
		if( points.size() > 0 ){
			String[] csv = new String[ points.size() + 1 ];
			csv[0] = "timestamp,x,y,z";
			for( int j = 0; j < points.size(); j++ ){
				PVector pt = (PVector) points.get( j );
				long t = (Long) times.get( j );
				csv[j+1] = t + "," + pt.x + "," + pt.y + "," + pt.z;
			}
			saveStrings( savePath + "marker-" + i + ".csv", csv );
		}
	}
}

// this function loads .patt filenames into a list of Strings based on a full path to a directory (relies on java.io)
String[] loadPatternFilenames(String path) {
	File folder = new File(path);	
	FilenameFilter pattFilter = new FilenameFilter() {
		public boolean accept(File dir, String name) {
			return name.toLowerCase().endsWith(".patt");
		}
	};	
	return folder.list(pattFilter);
}