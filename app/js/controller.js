var horariosApp = angular.module('horariosApp', []);

horariosApp.controller('StationsCtrl', function($scope, $http) {
	$http.get('todo.php').success(function(data) {

	});


	$scope.stations = [
		{
			code: 'BCHE2',
			name:'Basse-Chenaie',
			line: 'C7',
			terminus: 'Souillarderie',
			times: [
				'Proche',
				'2 mn',
				'13 mn'
			]
		},
		{
			code: 'VISO1',
			name:'Vison',
			line: '12',
			terminus: 'Jules Vernes',
			times: [
				'Proche',
				'4 mn',
				'25 mn'
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

		$scope.stations[0].times[0] = '0 mn';
		isUpdating = false;
	};

	setInterval($scope.updateTimestable, 10000);
});