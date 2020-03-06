angular
  .module('flightsApp')
  .factory('City', City);

City.$inject = ['$resource'];
function City($resource) {
  return new $resource('/api/cities/:id', { id: '@id' }, {
    update: { method: 'PUT' }
  });
}
