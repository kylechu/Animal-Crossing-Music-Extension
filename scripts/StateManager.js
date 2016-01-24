// Manages the current state of the extension, views can register to it
// and it will notify certain events.

'use strict';

function StateManager() {

	var self = this;

	var options = {};
	var callbacks = {};

	var timeKeeper = new TimeKeeper();
	var isKKTime;

	this.registerCallback = function(event, callback) {
		callbacks[event] = callbacks[event] || [];
		callbacks[event].push(callback);
	};

	this.getOption = function(option) {
		return options[option];
	};

	this.activate = function() {
		isKKTime = timeKeeper.getDay() == 6 && timeKeeper.getHour() >= 20;
		getSyncedOptions(function() {
			notifyListeners("volume", [options.volume]);
			if (isKK()) {
				notifyListeners("kkStart");
			} else {
				startHourMusic();
			}
		});
	};

	// Possible events include:
	// volume, kkStart, hourMusic, gameChange, pause
	function notifyListeners(event, args) {
		if (!options.paused || event === "pause") {
			var callbackArr = callbacks[event] || [];
			for(var i = 0; i < callbackArr.length; i++) {
				callbackArr[i].apply(window, args);
			}
		}
	}

	function startHourMusic() {
		var game = options.music;
		if (options.music == 'mix-all') {
			// Randomize game
			var rand = Math.floor(Math.random()*6);
			if (rand == 0)
				game = 'animal-forrest';
			else if (rand == 1)
				game = 'city-folk-snowing';
			else if (rand == 2)
				game = 'new-leaf';
			else if (rand == 3)
				game = 'new-leaf-snowing';
			else if (rand == 4)
				game = 'new-leaf-raining';
			else if (rand == 5)
				game = 'wild-world';
		}
		console.log("Playing from: " + game);
		notifyListeners("hourMusic", [timeKeeper.getHour(), game, false]);
	}

	function isKK() {
		return options.alwaysKK || (options.enableKK && isKKTime);
	}

	// retrieve saved options
	function getSyncedOptions(callback) {
		chrome.storage.sync.get({
			volume: 0.5,
			music: 'new-leaf',
			enableNotifications: true,
			enableKK: true,
			alwaysKK: false,
			paused: false,
			enableTownTune: true
		}, function(items) {
			options = items;
			if (typeof callback === 'function') {
				callback();
			}
		});
	}

	// If we're not playing KK, let listeners know the hour has changed
	// If we enter KK time, let listeners know
	timeKeeper.registerHourlyCallback(function(day, hour) {
		var wasKK = isKK();
		isKKTime = day == 6 && hour >= 20;
		if (isKK() && !wasKK) {
			notifyListeners("kkStart");
		} else if (!isKK()) {
			startHourMusic();
		}
	});

	// Update our options object if stored options changes, and notify listeners
	// of any pertinent changes.
	chrome.storage.onChanged.addListener(function(changes, namespace) {
		var wasKK = isKK();
		getSyncedOptions(function() {
			if (typeof changes.volume !== 'undefined') {
				notifyListeners("volume", [options.volume]);
			}
			if (typeof changes.music !== 'undefined' && !isKK()) {
				notifyListeners("gameChange", [timeKeeper.getHour(), options.music]);
			}
			if (isKK() && !wasKK) {
				notifyListeners("kkStart");
			}
			if (!isKK() && wasKK) {
				startHourMusic();
			}
		});
	});

	// play/pause when user clicks the extension icon
	chrome.browserAction.onClicked.addListener(function() {
		chrome.storage.sync.set({ paused: !options.paused }, function() {
			getSyncedOptions(function() {
				if (options.paused) {
					notifyListeners("pause");
				} else {
					self.activate();
				}
			});
		});
	});
}