#gesture-capture

A toolkit for tracking AR codes, and saving position/motion data to .csv files.


##Patterns

Uses the patterns from the [ARToolkit PatternMaker](http://www.cs.utah.edu/gdc/projects/augmentedreality/) found in ar_tracking/data/patterns/gif. Set "numMarkers" to define how many, so if you set 2 markers, then you should print off "4x4_384_1.gif" & "4x4_384_2.gif".


##Data

The data is saved to a timestamped folder in ar_tracking/data/results/ with a .csv file per marker tracked. The data has 4 columns:

* timestamp ( the time of this position )
* x ( the x coordinate of this marker at that time)
* y ( the y coordinate of this marker at that time)
* z ( the z coordinate of this marker at that time - not currently reported, is always 0.0 )


##Dependencies

* [Processing](http://processing.org) (tested on 2.0b8, should work on 1.5 and other 2.0 betas...)
* The [nyar4psg Library](http://nyatla.jp/nyartoolkit/wp/) should be installed in your Libraries folder.