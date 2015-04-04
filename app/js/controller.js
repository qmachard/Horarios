var horariosApp = angular.module('horariosApp', []);

horariosApp.controller('StationsCtrl', function($scope, $http) {
	$scope.stations = [
		{
			code: 'BCHE2',
			name:'Basse-Chenaie',
			line: 'C7',
			terminus: 'Souillarderie',
			times: [
				{
					time:'Proche',
					infotrafic: false
				},
				{
					time:'2 mn',
					infotrafic: true
				},
				{
					time:'13 mn',
					infotrafic: false
				}
			]
		},
		{
			code: 'VISO1',
			name:'Vison',
			line: '12',
			terminus: 'Jules Vernes',
			times: [
				{
					time:'16 mn',
					infotrafic: false
				},
				{
					time:'24 mn',
					infotrafic: false
				}
			]
		}
	];

	var isUpdating = false;
	$scope.updateTimestable = function(haveLoader) {
		// If is loading new timesTable exit
		if(isUpdating) return;
		isUpdating = true;

		// If must be a loader
		haveLoader = (typeof haveLoader === 'undefined') ? false : haveLoader;

		// Load API
		$scope.stations.forEach(function(station) {
			$http.get('https://open.tan.fr/ewp/tempsattente.json/'+station.code).success(function(data) {
				console.log()
			});
		});


		$scope.stations[0].times[0] = '0 mn';
		isUpdating = false;
	};

	//setInterval($scope.updateTimestable, 10000);
});