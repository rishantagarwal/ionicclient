angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, loginService, $ionicPopup,$ionicNavBarDelegate,sessionService) {
    sessionService.destroy('uid');
    $ionicNavBarDelegate.showBackButton(false); 
   // $scope.sessionCheck = sessionService.get('uid');
    $scope.data = {};
    $scope.login = function() {
      console.log("LOGIN user: " + $scope.data.username + " - PW: " + $scope.data.password);
      loginService.login($scope.data.username, $scope.data.password)
        .success(function(data) {
            //$state.go('tab.dash');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})

.controller('googleMapCtrl',function($location){
  $location.path("comgooglemaps://");
})

.controller('LogoutCtrl',function($scope,$location,$state,loginService,$ionicPopup,$ionicNavBarDelegate,sessionService){
  loginService.loginCheck();
  //$scope.sessionCheck = sessionService.get('uid');
  //$ionicNavBarDelegate.showBackButton(false);
  $scope.logMeOut = function(){
     
     loginService.logout().success(function(data){
        var alertPopup = $ionicPopup.alert({
                title: 'Logout ',
                template: 'You have been logged out.'
            });
        alertPopup.then(function(res){
           $location.path('/login');
        });    
      })
      .error(function(err){
         var alertPopup = $ionicPopup.alert({
                title: 'Logout failed!',
                template: err
            });
      });
     
  };
   
    $scope.redirectToLogin = function(){
       $location.path('/login');
    };
})


.controller('DashCtrl', function($scope,sessionService,loginService) {
   loginService.loginCheck();
   //$scope.sessionCheck = sessionService.get('uid');
})
.controller('CtrlPanelCtrl', function($scope,$ionicPopup,$timeout,$http,sessionService,loginService,postDataService) {
  
   loginService.loginCheck();
   //$scope.sessionCheck = sessionService.get('uid');
   
   $scope.data = {};

   // A confirm dialog
  $scope.showConfirm = function(Title,Message) {
     var confirmPopup = $ionicPopup.confirm({
       title: Title,
       template: Message
     });
     
      /* if(res) {
         console.log('You are sure');
         return "true";
       } else {
         console.log('You are not sure');
         return "false";
       }*/
     };
   

   // An alert dialog
   $scope.showAlert = function(Title,Message) {
     var alertPopup = $ionicPopup.alert({
       title: Title,
       template: Message
     });
     alertPopup.then(function(res) {
       console.log('Done !');
     });
   };

   /* ----------------
   * 1 - leavingOffice
   * 2 - returningOffice
   * 3 - startSales
   * 4 - endSales
   */ 
   
   //Leaving from the office
  $scope.leaveOffice= function(){
  var confirmPopup = $ionicPopup.confirm({
       title: "Leaving office !",
       template: "Are you sure you want to update the status !!"
     });
  confirmPopup.then(function (res) {
    if(res){
       postDataService.setStatus(1).success(function(data){
       $scope.showAlert("Leaving office !","Status updated");})
        .error(function(error){
        $scope.showAlert("Error","Failed to update status !!");
        });
                
        }
    
  else{
    $scope.showAlert("Error","Failed to update status !!");
  }

})};
   
   //Returning to the office
   $scope.returnOffice= function(){
   var confirmPopup = $ionicPopup.confirm({
       title: "Returning to office !",
       template: "Are you sure you want to update the status !!"
     });
  confirmPopup.then(function (res) {
    if(res){
       postDataService.setStatus(2).success(function(data){
       $scope.showAlert("Returning to office !","Status updated");})
        .error(function(error){
        $scope.showAlert("Error","Failed to update status !!");
        });
                
        }
    
  else{
    $scope.showAlert("Error","Failed to update status !!");
  }

})};
    
   
   //Starting sales for the day
   $scope.startSales= function(){
    var confirmPopup = $ionicPopup.confirm({
       title: "Starting office !",
       template: "Are you sure you want to update the status !!"
     });
  confirmPopup.then(function (res) {
    if(res){
       postDataService.setStatus(3).success(function(data){
       $scope.showAlert(" Start !","Status updated");})
        .error(function(error){
        $scope.showAlert("Error","Failed to update status !!");
        });
                
        }
    
  else{
    $scope.showAlert("Error","Failed to update status !!");
  }

})};
    
   
   //Ending sales for the day 
   $scope.endSales= function(){
    var confirmPopup = $ionicPopup.confirm({
       title: "Ending sales !",
       template: "Are you sure you want to update the status !!"
     });
  confirmPopup.then(function (res) {
    if(res){
       postDataService.setStatus(1).success(function(data){
       $scope.showAlert("Ending sales !","Status updated");})
        .error(function(error){
        $scope.showAlert("Error","Failed to update status !!");
        });
                
        }
    
  else{
    $scope.showAlert("Error","Failed to update status !!");
  }

})};
});
