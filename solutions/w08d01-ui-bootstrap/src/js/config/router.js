angular
  .module('birdApp')
  .config(Router);

Router.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
function Router($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('birdsIndex', {
      url: '/birds',
      templateUrl: 'js/views/birds/index.html',
      controller: 'BirdsIndexCtrl as birdsIndex'
    })
    .state('birdsNew', {
      url: '/birds/new',
      templateUrl: 'js/views/birds/new.html',
      controller: 'BirdsNewCtrl as birdsNew'
    })
    .state('birdsShow', {
      url: '/birds/:id',
      templateUrl: 'js/views/birds/show.html',
      controller: 'BirdsShowCtrl as birdsShow'
    })
    .state('birdsEdit', {
      url: '/birds/:id/edit',
      templateUrl: 'js/views/birds/edit.html',
      controller: 'BirdsEditCtrl as birdsEdit'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'js/views/auth/login.html',
      controller: 'LoginCtrl as login'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'js/views/auth/register.html',
      controller: 'RegisterCtrl as register'
    });

  $urlRouterProvider.otherwise('/birds');
}
