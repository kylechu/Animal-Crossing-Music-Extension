'use strict';

(function() {
	var stateManager = new StateManager();
	var audioManager = new AudioManager(stateManager.registerCallback, function() {
		return stateManager.getOption("enableTownTune");
	});
	var notificationManager = new NotificationManager(stateManager.registerCallback, function() {
		return stateManager.getOption("enableNotifications");
	});
	var badgeManager = new BadgeManager(stateManager.registerCallback);
	
	stateManager.activate();
	
	chrome.storage.sync.get('icon', function(icon) {
	    if (icon.icon == 'leaf-icon')
	    	chrome.browserAction.setIcon({path: 'img/icon_leaf_32.png'});
	});

})();
