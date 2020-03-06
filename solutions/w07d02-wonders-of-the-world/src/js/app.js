angular
  .module('wondersApp', ['ui.router'])
  .controller('WondersCtrl', WondersCtrl);

WondersCtrl.$inject = ['$http', '$stateParams'];
function WondersCtrl($http, $stateParams) {
  const vm = this;
  vm.all = [];
  vm.chosenWonder = {};

  indexWonders();

  function indexWonders() {
    $http.get('/api/wonders')
      .then((response) => {
        vm.all = response.data;
      });
  }

  vm.chosenWonder = chosenWonder;

  function chosenWonder() {
    return vm.all.find((wonder) => {
      return wonder.id === $stateParams.id;
    });
  }
}
