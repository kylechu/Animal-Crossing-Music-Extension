// Handles fetching the new weather and notifying a callback when it changes

'use strict';

function WeatherManager(zip, country) {

	var timeout;
	var callback;

	var weather;

	var weatherRain = ['Thunderstorm', 'Drizzle', 'Rain', 'Mist'];
 	var weatherSnow = ['Snow', 'Fog'];

 	window.testFunc = function(_kyle) {
 		weather = _kyle;
 		callback();
 	}

 	window.whatis = function() {
 		return weather;
 	}

 	var self = this;

 	window.getit = function() {
 		return self.getWeather();
 	}

	this.registerChangeCallback = function(cb) {
		callback = cb;
	};

	this.setZip = function(newZip) {
		zip = newZip;
		restartCheckLoop();
	};

	this.setCountry = function(newCountry) {
		country = newCountry;
		restartCheckLoop();
	};

	this.getWeather = function() {
		if(weatherRain.indexOf(weather) > -1) {
			return "Rain";
		} else if(weatherSnow.indexOf(weather) > -1) {
			return "Snow";
		} else {
			return "Clear";
		}
	};

	function restartCheckLoop() {
		if(timeout) clearTimeout(timeout);
		timeout = null;
		weatherCheckLoop();
	}

	var weatherCheckLoop = function() {
		//if appid is not valid nothing will be returned
	 	var appid = "e7f97bd1900b94491d3263f89cbe28d6";
	 	var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + zip + "," + country + "&appid=" + appid;
	 
	 	var request = new XMLHttpRequest();
	 
	 	request.onreadystatechange = function() {
 			if(request.readyState == 4 && request.status == 200) {
 				var response = JSON.parse(request.responseText);
 				if( response.cod == "200" && response.weather[0].main !== weather) {
 					weather = response.weather[0].main;
 					if( typeof callback === 'function' ) {
 						callback();
 					}
 				}
 			}
 		}
	 
	 	request.open("GET", url, true);
	 	request.send();
	 	timeout = setTimeout(weatherCheckLoop, 300000);
	};

	weatherCheckLoop();

}

