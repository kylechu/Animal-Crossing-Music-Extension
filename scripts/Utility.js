// Globally accessable helper functions

'use strict';

// format text for the badge and for the song URL
function formatHour(time) {
	if (time === -1) {
		return '';
	}
	if (time === 0) {
		return '12a';
	}
	if (time === 12) {
		return '12p';
	}
	if (time < 13) {
		return time + 'a';
	}
	return (time - 12) + 'p';
}

function getHolidays() {
	return {
		// date: kk song to play
		// todo: change numbers to song names, add these songs to the kk folder
		'0/1': '1', // new years: stale-cupcakes?
		'1/14': '2', // valentines: love-song
		'9/31': '3', // halloween: dirge
		'11/25': '4', // christmas: chorale?
		'11/31': '5' // new years: stale-cupcakes?
	};
}

// check if today is a holiday
function isHoliday() {
	var date = new Date();
	var today = date.getMonth() + '/' + date.getDate();
	return today in getHolidays();
}

