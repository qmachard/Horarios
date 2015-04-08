var phonecatControllers = angular.module('phonecatControllers', []);

var stations = null;

var getStationsStored = function() {
	if(localStorage && localStorage.getItem('stations') != null) {
		return JSON.parse(localStorage.getItem('stations'));
	} else {
		return [];
	}
};
var setStationsStored = function(stations) {
	localStorage.setItem('stations', JSON.stringify(stations));
};

var getStations = function(callback, $http) {
	if(stations == null) {
		var http = $http.get('https://open.tan.fr/ewp/arrets.json');
		http.success(function(data) {
			data.error = false;
			stations = data; // On sauvegarde les stations pour la prochaine fois

			callback(stations);
		});
		http.error(function() {
			callback({
				error: "Vous n'êtes pas connectés à internet"
			});
		});
	} else {
		callback(stations);
	}
};

var getDirections = function(station, line, callback, $http) {
	for(var direction=1; direction<=2; direction++) {
		getDirection(station, line, direction, callback, $http);
	}
};
var getDirection = function(station, line, direction, callback, $http) {
	var http = $http.get('https://open.tan.fr/ewp/horairesarret.json/' + station + '/' + line + '/' + direction);
	http.success(function(data) {
		callback({
			direction:direction,
			code:data.arret.codeArret,
			name:data.ligne['directionSens' + direction],
			station:data.arret.libelle,
			error: false
		});
	});
	http.error(function() {
		callback({
			error: "Vous n'êtes pas connectés à internet"
		});
	});
};

phonecatControllers.controller('TimestableCtrl', function($scope, $http) {
	$scope.stations = getStationsStored();

	$scope.updateTimestable = function() {
		// Load API
		$scope.stations.forEach(function(station) {
			if(station.updating) return; // If station is already updating, exit.
			station.updating = true;
			station.error = false;

			var http = $http.get('https://open.tan.fr/ewp/tempsattente.json/'+station.code);
			http.success(function(data) {
				station.times = parseTimes(data);
				station.updating = false;

				if(station.times.length == 0) {
					station.error = "Il n'y a plus de passage";
				}
			});
			http.error(function() {
				station.updating = false;
				station.error = "Impossible de se connecter à internet.";
			});
		});
	};

	$scope.removeStation = function() {
		if(confirm('Voulez-vous vraiment supprimer "'+this.station.name+'"'))
		var stations_stored = getStationsStored();
		var stations = [];
		for(var i=0; i<stations_stored.length; i++) {
			if(stations_stored[i].code != this.station.code)
				stations[stations.length] = stations_stored[i];
		}
		setStationsStored(stations);
		$scope.stations = stations;
	};

	var parseTimes = function(data) {
		var times = [];
		for(var i=0; i < data.length; i++) {
			times[i] = {
				time: data[i].temps,
				infotrafic: data[i].infotrafic
			};
		}

		return times;
	};

	setInterval($scope.updateTimestable, 60000);
	$scope.updateTimestable();
});

phonecatControllers.controller('StationsCtrl', function($scope, $http) {
	$scope.stations = [];

	$scope.loading = true;
	$scope.error = false;

	getStations(function(data) {
		if(data.error === false) {
			for(var i=0; i<stations.length; i++) {
				$scope.stations[i] = {
					code: data[i].codeLieu,
					name: data[i].libelle,
					lines: []
				};

				for(var j=0; j<data[i].ligne.length; j++) {
					$scope.stations[i].lines[j] = {
						line: data[i].ligne[j].numLigne
					};
				}
			}
		} else {
			$scope.error = data.error;
		}
		$scope.loading = false;

	}, $http);
});

phonecatControllers.controller('StationLinesCtrl', function($scope, $http, $routeParams) {
	$scope.loading = true;
	$scope.error = false;
	$scope.line = {
		line: $routeParams.line,
		directions: []
	};

	getDirections($routeParams.station, $routeParams.line, function(data) {
		if(data.error === false) {
			$scope.line.directions[data.direction-1] = data;
			$scope.line.directions[data.direction-1].line = $routeParams.line;
		} else {
			$scope.error = data.error;
		}
		$scope.loading = false;
	}, $http);

	$scope.addStation = function() {
		var stations_stored = getStationsStored();
		stations_stored[stations_stored.length] = {
			code: this.direction.code,
			line: this.direction.line,
			terminus: this.direction.name,
			name: this.direction.station,
			times: []
		};
		setStationsStored(stations_stored);
		window.location.hash = '/timestable';
	}
});