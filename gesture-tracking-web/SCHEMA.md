#Collection Schema

##TrackingSessions

```

{
	startTime: <unix epoch timestamp> (number),
	config: {
		snapshotInterval: <time in milliseconds> (number),
		inputRatio: <camera ratio - height/width> (number)
	}
	data: 	[
		{
			timestamp: <unix epoch timestamp> (number),
			left1: {
				present: <is this marker visible> (boolean),
				x: <normalised coordinate> (number),
				y: <normalised coordinate> (number)
			},
			right1: {
				present: <is this marker visible> (boolean),
				x: <normalised coordinate> (number),
				y: <normalised coordinate> (number)
			},
			left2: {
				present: <is this marker visible> (boolean),
				x: <normalised coordinate> (number),
				y: <normalised coordinate> (number)
			},
			right2: {
				present: <is this marker visible> (boolean),
				x: <normalised coordinate> (number),
				y: <normalised coordinate> (number)
			}
		},
		{
			timestamp: <unix epoch timestamp> (number),
			left1: {
				present: <is this marker visible> (boolean),
				x: <normalised coordinate> (number),
				y: <normalised coordinate> (number)
			},
			right1: {
				present: <is this marker visible> (boolean),
				x: <normalised coordinate> (number),
				y: <normalised coordinate> (number)
			},
			left2: {
				present: <is this marker visible> (boolean),
				x: <normalised coordinate> (number),
				y: <normalised coordinate> (number)
			},
			right2: {
				present: <is this marker visible> (boolean),
				x: <normalised coordinate> (number),
				y: <normalised coordinate> (number)
			}
		},
		{
			timestamp: <unix epoch timestamp> (number),
			left1: {
				present: <is this marker visible> (boolean),
				x: <normalised coordinate> (number),
				y: <normalised coordinate> (number)
			},
			right1: {
				present: <is this marker visible> (boolean),
				x: <normalised coordinate> (number),
				y: <normalised coordinate> (number)
			},
			left2: {
				present: <is this marker visible> (boolean),
				x: <normalised coordinate> (number),
				y: <normalised coordinate> (number)
			},
			right2: {
				present: <is this marker visible> (boolean),
				x: <normalised coordinate> (number),
				y: <normalised coordinate> (number)
			}
		},
		...
	],
	snapshots:	[
		{
			timestamp: <unix epoch timestamp> (number),
			image: <image data> (Base64 Data: URL)
		},
		{
			timestamp: <unix epoch timestamp> (number),
			image: <image data> (Base64 Data: URL)
		}
		...
	]
}

```