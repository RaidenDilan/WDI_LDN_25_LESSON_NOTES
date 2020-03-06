angular
  .module('donutApp', [])
  .controller('DonutsCtrl', DonutsCtrl);

DonutsCtrl.$inject = ['$http'];
function DonutsCtrl($http) {
  const vm = this;
  vm.all = [];
  vm.newDonut = {};
  vm.donutsCreate = donutsCreate;
  vm.donutsDelete = donutsDelete;

  donutsIndex();

  function donutsIndex() {
    $http.get('http://localhost:3000/donuts')
      .then((response) => {
        vm.all = response.data;
      });
  }

  function donutsCreate(){
    $http
      .post('http://localhost:3000/donuts', vm.newDonut)
      .then(response => {
        vm.all.push(response.data);
        // vm.newPresident = {};
        // console.log(vm.newPresident);
      });
  }

  function donutsDelete(donut){
    $http
      .delete(`http://localhost:3000/donuts/${donut.id}`)
      .then(() => {
        const index = vm.all.indexOf(donut);
        vm.all.splice(index, 1);
      });
  }
}
