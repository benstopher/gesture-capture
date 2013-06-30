// debug
// triggers ARtoolkit debug canvas
DEBUG = false;

CONF = {};

CONF.MarkerNames = [ 'left1', 'right1', 'left2', 'right2' ];

// styling, naming and association info for markers
CONF.MarkerNameToId = {
	'left1': 0,
	'right1': 1,
	'left2': 2,
	'right2': 3
};

CONF.MarkerInfo = [
	{ 
		association: 'left1',
		color: [
			'249',
			'140',
			'140'
		],
		hex: '#F98C8C'
	},
	{ 
		association: 'right2',
		color: [
			'125',
			'226',
			'192'
		],
		hex: '#7DE2C0'
	},
	{ 
		association: 'left2',
		color: [
			'244',
			'194',
			'71'
		],
		hex: '#F4C247'
	},
	{ 
		association: 'right2',
		color: [
			'203',
			'148',
			'232'
		],
		hex: '#CB94E8'
	}
];

//collections
TrackingSessions = new Meteor.Collection( "tracking-sessions" );
