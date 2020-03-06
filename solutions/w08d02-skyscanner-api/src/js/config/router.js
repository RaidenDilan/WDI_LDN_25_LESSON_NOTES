angular
  .module('flightsApp')
  .config(Router);

Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function Router($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('citiesIndex', {
      url: '/cities',
      templateUrl: 'js/views/cities/index.html',
      controller: 'CitiesIndexCtrl as citiesIndex'
    })
    .state('citiesNew', {
      url: '/cities/new',
      templateUrl: 'js/views/cities/new.html',
      controller: 'CitiesNewCtrl as citiesNew'
    })
    .state('citiesShow', {
      url: '/cities/:id',
      templateUrl: 'js/views/cities/show.html',
      controller: 'CitiesShowCtrl as citiesShow'
    });

  $urlRouterProvider.otherwise('/cities');
}
