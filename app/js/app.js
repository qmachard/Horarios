var horariosApp = angular.module('horariosApp', [
	'ngRoute',
	'phonecatControllers'
]);

horariosApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/timestable', {
				templateUrl: 'partials/timestable.html',
				controller: 'TimestableCtrl'
			})
			.when('/stations', {
				templateUrl: 'partials/stations.html',
				controller: 'StationsCtrl'
			})
			.when('/station/:code', {
				templateUrl: 'partials/station.html',
				controller: 'StationLinesCtrl'
			})
			.otherwise({
				redirectTo: '/timestable'
			});
	}
]);