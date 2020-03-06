angular
  .module('portfolioApp')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope'];
function MainCtrl($rootScope){
  const vm = this;


  function stateChange(e, toState) {
    vm.pageName = toState.name;
    vm.menuIsOpen = false;
  }

  $rootScope.$on('$stateChangeStart', stateChange);
}
