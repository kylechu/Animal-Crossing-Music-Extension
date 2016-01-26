// Handles the badge on the icon

'use strict';

function BadgeManager(addEventListener, isEnabled) {

	chrome.storage.sync.get('icon', function(icon) {
	    if (icon.icon == 'leaf-icon')
	    	setIcon('leaf');
	    else
	    	setIcon('kk');
	});

	addEventListener("hourMusic", function(hour) {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: formatHour(hour) });
		}
		//setIcon('play');
	});
	
	addEventListener("weatherMusic", function(hour, music, weather) {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: weather });
		}
		//setIcon('play');
	});

	addEventListener("kkStart", function() {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: "KK" });
		}
		//setIcon('play');
	});

	addEventListener("pause", function() {
		if(isEnabled()) {
			chrome.browserAction.setBadgeText({ text: "" });
		}
		//setIcon('pause');
	});
	
	function setIcon(icon) {
		var icon_path;
		if (icon == 'pause')
			icon_path = 'img/icon_38_leaf-02.png';
		else if (icon == 'play')
			icon_path = 'img/icon_38_leaf-01.png';
		else if (icon == 'leaf')
			icon_path = 'img/icon_leaf_38.png';
		else if (icon == 'kk')
			icon_path = 'img/icon_38.png';
		chrome.browserAction.setIcon({
			path: icon_path
		});
	}

	chrome.browserAction.setBadgeBackgroundColor({ color: [57, 230, 0, 255] });
}