// Handles playing hourly music, KK, and the town tune.

'use strict';

function AudioManager(addEventListener, isTownTune) {

	var audio = document.createElement('audio');
	var townTuneManager = new TownTuneManager();

	// isHourChange is true if it's an actual hour change,
	// false if we're activating music in the middle of an hour
	function playHourlyMusic(hour, game, isHourChange) {
		audio.loop = true;
		audio.removeEventListener("ended", playKKSong);
		if (game == 'mix-all') {
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
			console.log("Playing from: " + game);
		}
		var fadeOutLength = isHourChange ? 3000 : 500;
		fadeOutAudio(fadeOutLength, function() {
			if (isHourChange && isTownTune()) {
				townTuneManager.playTune(function() {
					audio.src = '../' + game + '/' + formatHour(hour) + 'm.ogg';
					audio.play();
				});
			} else {
				audio.src = '../' + game + '/' + formatHour(hour) + 'm.ogg';
				audio.play();
			}
		});
	}

	function playKKMusic() {
		audio.loop = false;
		audio.addEventListener("ended", playKKSong);
		fadeOutAudio(500, playKKSong);
	}

	function playKKSong() {
		if (isHoliday()) {
			var date = new Date();
			var today = date.getMonth() + '/' + date.getDate();
			audio.src = '../kk/' + getHolidays()[today] + '.ogg';
		}
		else {
			var randomSong = Math.floor((Math.random() * 36) + 1).toString();
			audio.src = '../kk/' + randomSong + '.ogg';
		}
		audio.play();
	}

	// Fade out audio and call callback when finished.
	function fadeOutAudio(time, callback) {
		if (audio.paused) {
			if (callback) callback();
		} else {
			var oldVolume = audio.volume;
			var step = audio.volume / (time / 100.0);
			var fade = setInterval(function() {
				if (audio.volume > step) {
					audio.volume -= step;
				} else {
					clearInterval(fade);
					audio.pause();
					audio.volume = oldVolume;
					if (callback) callback();
				}
			}, 100);
		}
	}

	addEventListener("hourMusic", playHourlyMusic);

	addEventListener("kkStart", playKKMusic);

	addEventListener("gameChange", playHourlyMusic);

	addEventListener("pause", function() {
		audio.pause();
	});

	addEventListener("volume", function(newVol) {
		audio.volume = newVol;
	});

}