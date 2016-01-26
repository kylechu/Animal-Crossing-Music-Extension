// Manages the current state of the extension, views can register to it
// and it will notify certain events.

'use strict';

function StateManager() {

	var self = this;

	var options = {};
	var callbacks = {};

	var timeKeeper = new TimeKeeper();
	var isKKTime;
	
	var weatherRain = ['Thunderstorm', 'Drizzle', 'Rain', 'Mist'];
	var weatherSnow = ['Snow', 'Fog'];
	var weather = "Clear";

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
			}
			else if(isLive()) {
				if(options.music == 'new-leaf-live') {
					updateWeatherCond(options.zipCode, options.countryCode, function(response) {
					if(response.cod == 200) {
						weather = response.weather[0].main;
						if(weatherRain.indexOf(weather) > -1)
							weather = "Rain";
						else if(weatherSnow.indexOf(weather) > -1)
							weather = "Snow";
						else
							weather = "Clear";
						notifyListeners("weatherMusic", [timeKeeper.getHour(), options.music, weather, false]);
					}
					else
						alert(JSON.stringify(response));
					});
				}
			}
			else {
				startHourMusic();
			}
		});
	};

	// Possible events include:
	// volume, kkStart, hourMusic, weatherMusic, gameChange, weatherChange, pause
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
	
	function isLive() {
		return options.music == 'new-leaf-live';
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
			enableTownTune: true,
			//enableAutoPause: false,
			zipCode: "98052",
			countryCode: "us",
			enableBadgeText: true
		}, function(items) {
			options = items;
			if (typeof callback === 'function') {
				callback();
			}
		});
	}
	
	// get current weather conditions using openweathermap: http://openweathermap.org/current
	function updateWeatherCond(zip, country, cb) {
		//if appid is not valid nothing will be returned
		var appid = "e7f97bd1900b94491d3263f89cbe28d6";
		var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + zip + "," + country + "&appid=" + appid;

		var request = new XMLHttpRequest();

		request.onreadystatechange = function() {
				if(request.readyState == 4 && request.status == 200) {
					if( typeof cb === 'function' )
						cb(JSON.parse(request.responseText));
				}
			}

		request.open("GET", url, true);
		request.send();
	}

	// If we're not playing KK, let listeners know the hour has changed
	// If we enter KK time, let listeners know
	timeKeeper.registerHourlyCallback(function(day, hour) {
		var wasKK = isKK();
		isKKTime = day == 6 && hour >= 20;
		if (isKK() && !wasKK) {
			notifyListeners("kkStart");
		}
		else if(isLive()) {
			if(options.music == 'new-leaf-live') {
				updateWeatherCond(options.zipCode, options.countryCode, function(response) {
				if(response.cod == 200) {
					weather = response.weather[0].main;
					if(weatherRain.indexOf(weather) > -1)
						weather = "Rain";
					else if(weatherSnow.indexOf(weather) > -1)
						weather = "Snow";
					else
						weather = "Clear";
					notifyListeners("weatherMusic", [timeKeeper.getHour(), options.music, weather, true]);
				}
				else
					alert(JSON.stringify(response));
				});
			}
		}
		else if (!isKK()) {
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
			if (typeof changes.music !== 'undefined' && !isLive() && !isKK()) {
				notifyListeners("gameChange", [timeKeeper.getHour(), options.music]);
			}
			if (!isKK() && isLive() && (typeof changes.music !== 'undefined' || typeof changes.zipCode !== 'undefined' || typeof changes.countryCode !== 'undefined')) {
				notifyListeners("weatherChange", [timeKeeper.getHour(), options.music, weather]);
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