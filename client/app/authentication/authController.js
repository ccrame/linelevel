module.exports = function AuthController($http, $scope){
  $scope.signIn = function(){
    $http.post('/auth/signin',$scope.credentials);
  };

  $scope.signUp = function(){
    $http.post('/auth/signup',$scope.credentials);
  };
};
