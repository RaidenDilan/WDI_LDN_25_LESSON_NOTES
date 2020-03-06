angular
  .module('wondersApp')
  .directive('wonder', wonder);

function wonder() {
  const directive = {
    restrict: 'E',
    replace: true,
    templateUrl: 'js/views/wonderView.html',
    scope: {
      wonderItem: '=' // Object
      // wonderItem: '@' // String
    },
    link(attr, element, scope) {}
  };
  return directive;
}
