var horariosApp = angular.module('horariosApp', []);

horariosApp.controller('StationsCtrl', function($scope) {
	$scope.stations = [
		{
			'name':'Basse-Chenaie',
			'line': 'C7',
			'terminus': 'Souillarderie'
		},
		{
			'name':'Vison',
			'line': '12',
			'terminus': 'Jules Vernes'
		}
	];
});