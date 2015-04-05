var horariosApp = angular.module('horariosApp', []);

horariosApp.controller('StationsCtrl', function($scope, $http) {
	$scope.stations = [
		{
			code: 'BCHE2',
			name:'Basse-Chenaie',
			line: 'C7',
			terminus: 'Souillarderie',
			times: [],
			updating: false,
			error: false
		},
		{
			code: 'VISO1',
			name:'Vison',
			line: '12',
			terminus: 'Jules Vernes',
			times: [],
			updating: false,
			error: false
		}
	];

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
			});
			http.error(function() {
				station.updating = false;
				station.error = "Impossible de se connecter à internet. Les horaires ne sont pas à jour.";
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