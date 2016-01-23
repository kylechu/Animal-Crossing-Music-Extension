'use strict';

function saveOptions() {
	var volume = document.getElementById('volume').value;
	var enableNotifications = document.getElementById('enable-notifications').checked;
	// 2 separate KK variables to preserve compatibility with old versions
	var alwaysKK = document.getElementById('always-kk').checked;
	var enableKK = alwaysKK || document.getElementById('enable-kk').checked;
  	var enableTownTune = document.getElementById('enable-town-tune').checked;

	var music;
	if (document.getElementById('animal-forrest').checked) {
		music = 'animal-forrest';
	}
	else if (document.getElementById('wild-world').checked) {
		music = 'wild-world';
	}
	else if (document.getElementById('wild-world-snowing').checked) {
		music = 'wild-world-snowing';
	}
	else if (document.getElementById('new-leaf').checked) {
		music = 'new-leaf';
	}
	else if (document.getElementById('new-leaf-snowing').checked) {
		music = 'new-leaf-snowing';
	}
	else if (document.getElementById('new-leaf-raining').checked) {
		music = 'new-leaf-raining';
	}

	var icon;
	if (document.getElementById('kk-icon').checked) {
		icon = 'kk-icon';
	}
	else if (document.getElementById('leaf-icon').checked) {
		icon = 'leaf-icon';
	}
	
	chrome.storage.sync.set({
		volume: volume,
		music: music,
		enableNotifications: enableNotifications,
		enableKK: enableKK,
		alwaysKK: alwaysKK,
		enableTownTune: enableTownTune,
		icon: icon
	}, function() { });
}

function restoreOptions() {
	chrome.storage.sync.get({
		volume: 0.5,
		music: 'new-leaf',
		enableNotifications: true,
		enableKK: true,
		alwaysKK: false,
		enableTownTune: true,
		icon: 'kk-icon'
	}, function(items) {
		document.getElementById('volume').value = items.volume;
		document.getElementById(items.music).checked = true;
		document.getElementById('enable-notifications').checked = items.enableNotifications;
		document.getElementById('no-kk').checked = true;
		document.getElementById('enable-kk').checked = items.enableKK;
		document.getElementById('always-kk').checked = items.alwaysKK;
		document.getElementById('enable-town-tune').checked = items.enableTownTune;
		document.getElementById(items.icon).checked = true;
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);

document.getElementById('volume').onchange = saveOptions;
document.getElementById('animal-forrest').onclick = saveOptions;
document.getElementById('wild-world').onclick = saveOptions;
document.getElementById('wild-world-snowing').onclick = saveOptions;
document.getElementById('new-leaf').onclick = saveOptions;
document.getElementById('new-leaf-snowing').onclick = saveOptions;
document.getElementById('new-leaf-raining').onclick = saveOptions;
document.getElementById('no-kk').onclick = saveOptions;
document.getElementById('enable-kk').onclick = saveOptions;
document.getElementById('always-kk').onclick = saveOptions;
document.getElementById('enable-notifications').onclick = saveOptions;
document.getElementById('enable-town-tune').onclick = saveOptions;
document.getElementById('kk-icon').onclick = function() {
	chrome.browserAction.setIcon({path: 'img/icon_32.png'})
	saveOptions();
}
document.getElementById('leaf-icon').onclick = function() {
	chrome.browserAction.setIcon({path: 'img/icon_leaf_32.png'})
	saveOptions();
}

// About/Help
document.getElementById('get-help').onclick = function() {
	window.open('https://chrome.google.com/webstore/detail/animal-crossing-music/fcedlaimpcfgpnfdgjbmmfibkklpioop/support');
};
document.getElementById('report-an-issue').onclick = function() {
	window.open('https://chrome.google.com/webstore/detail/animal-crossing-music/fcedlaimpcfgpnfdgjbmmfibkklpioop/support');
};
document.getElementById('help-us-out').onclick = function() {
	window.open('https://github.com/JdotCarver/Animal-Crossing-Music-Extension/');
};
