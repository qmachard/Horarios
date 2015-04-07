var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('TimestableCtrl', function($scope, $http) {
	$scope.stations = [];

	if(!(localStorage && localStorage.getItem('stations') != null)) {
		localStorage.setItem('stations', '[{"code":"BCHE2","name":"Basse-Chenaie","line":"C7","terminus":"Souillarderie","times":[],"updating":false,"error":false},{"code":"VISO1","name":"Vison","line":"12","terminus":"Jules Vernes","times":[],"updating":false,"error":false}]')
	}
	$scope.stations = JSON.parse(localStorage.getItem('stations'));

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

var stations = null;

var loadStations = function(callback, $scope, $http) {
	if(stations == null) {
		var http = $http.get('https://open.tan.fr/ewp/arrets.json');
		http.success(function(data) {
			stations = data;

			$scope.loading = false;
			$scope.error = false;

			console.log(data);

			callback(data, $scope);
		});
		http.error(function() {
			$scope.loading = false;
			$scope.error = true;
		});
	} else {
		$scope.loading = false;
		callback(stations, $scope);
	}
};

phonecatControllers.controller('StationsCtrl', function($scope, $http) {
	$scope.stations = [];

	$scope.loading = true;
	$scope.error = false;

	loadStations(function(data, $scope) {
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
		console.log($scope.stations);
	}, $scope, $http);
});

phonecatControllers.controller('StationLinesCtrl', function($scope, $http, $routeParams) {
	$scope.loading = true;
	$scope.error = false;
	$scope.directions = [];

	var http = $http.get('https://open.tan.fr/ewp/horairesarret.json/'+$routeParams.station+'/'+$routeParams.line+'/2');
	http.success(function(data) {
		console.log(data);
		$scope.directions[1] = {
			code:$routeParams.station+1,
			name:data.line.directionSens1
		};
		$scope.directions[2] = {
			code:$routeParams.station+2,
			name:data.line.directionSens2
		};

		$scope.loading = false;
		$scope.error = false;
	});
	http.error(function() {
		$scope.loading = false;
		$scope.error = "Vous n'êtes pas connectés à internet";
	});

	function addStation(code) {
		console.log(code);
	}
});