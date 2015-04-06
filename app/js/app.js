var horariosApp = angular.module('horariosApp', ['ngRoute']);

horariosApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/timestable', {
				templateUrl: 'partials/phone-list.html',
				controller: 'TimestableCtrl'
			}).
			when('/stations', {
				templateUrl: 'partials/phone-detail.html',
				controller: 'PhoneDetailCtrl'
			}).
			otherwise({
				redirectTo: '/timestable'
			});
	}
]);