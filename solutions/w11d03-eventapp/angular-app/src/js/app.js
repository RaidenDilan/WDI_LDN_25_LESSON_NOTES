angular
  .module('eventApp', ['ui.router', 'ngResource', 'satellizer', 'checklist-model'])
  .constant('API_URL', 'http://localhost:3000/api');
