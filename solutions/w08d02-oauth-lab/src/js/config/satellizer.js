angular
  .module('githubAuth')
  .config(Auth);

Auth.$inject = ['$authProvider'];
function Auth($authProvider) {
  $authProvider.signupUrl = '/api/register';
  $authProvider.loginUrl = '/api/login';

  $authProvider.github({
    clientId: '0f7299829c8d3fc4aa31',
    url: '/api/oauth/github'
  });

  $authProvider.facebook({
    clientId: '',
    url: '/api/oauth/facebook'
  });
}
