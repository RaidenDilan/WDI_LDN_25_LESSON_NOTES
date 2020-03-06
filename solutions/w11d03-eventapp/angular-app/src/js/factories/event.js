angular
  .module('eventApp')
  .factory('Event', Event);

Event.$inject = ['$resource', 'API_URL'];
function Event($resource, API_URL) {
  return new $resource(`${API_URL}/events/:id`, { id: '@id' }, {
    update: { method: 'PUT' }
  });
}
