angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, loginService, $ionicPopup,$ionicNavBarDelegate,sessionService) {
    sessionService.destroy('uid');
    $ionicNavBarDelegate.showBackButton(false); 
    $scope.sessionCheck = sessionService.get('uid');
    $scope.data = {};
    $scope.login = function() {
      console.log("LOGIN user: " + $scope.data.username + " - PW: " + $scope.data.password);
      loginService.login($scope.data.username, $scope.data.password).success(function(data) {
            //$state.go('tab.dash');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})

.controller('LogoutCtrl',function($scope,$location,$state,loginService,$ionicPopup,$ionicNavBarDelegate,sessionService){
  loginService.loginCheck();
  $scope.sessionCheck = sessionService.get('uid');
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
   $scope.sessionCheck = sessionService.get('uid');
})
.controller('CtrlPanelCtrl', function($scope,$ionicPopup,$timeout,$http,sessionService,loginService,postDataService) {
  
   loginService.loginCheck();
   $scope.sessionCheck = sessionService.get('uid');
   
   $scope.data = {};

   // A confirm dialog
  $scope.showConfirm = function(Title,Message) {
     var confirmPopup = $ionicPopup.confirm({
       title: Title,
       template: Message
     });
     confirmPopup.then(function(res) {
         console.log(res);
         return res;
      /* if(res) {
         console.log('You are sure');
         return "true";
       } else {
         console.log('You are not sure');
         return "false";
       }*/
     });
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
     console.log("Left from office");
     var rslt= $scope.showConfirm("Leaving office !","Are you sure you want to update the status !!");
     if(rslt){
                postDataService.setStatus(1).success(function(data){
                    $scope.showAlert("Leaving office !","Status updated");
                })
              .error(function(error){
                $scope.showAlert("Error","Failed to update status !!");
              })
                
            }
            
         
        
           
            //.error(function(response){});
     
   };
   
   //Returning to the office
   $scope.returnOffice= function(){
     console.log("Returning to the office");
   };
   
   //Starting sales for the day
   $scope.startSales= function(){
     console.log("Starting sales for the day");
   };
   
   //Ending sales for the day 
   $scope.endSales= function(){
     console.log("Ending sales for the day");
   };
   
   

});
