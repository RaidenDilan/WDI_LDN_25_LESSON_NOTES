angular
  .module('wondersApp')
  .config(Router);

Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function Router($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: '/js/views/index.html'
    })
    .state('show', {
      url: '/wonders/:id',
      templateUrl: '/js/views/show.html'
    });

  $urlRouterProvider.otherwise('/');
}
