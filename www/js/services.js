angular.module('starter.services', [])

.factory('sessionService', ['$http', function($http){
	return{
		set:function(key,value){
		  console.log("Session Service - set");
			return sessionStorage.setItem(key,value);
		},
		get:function(key){
		  console.log("Session Service - get ");
			return sessionStorage.getItem(key);
		},
		destroy:function(key){
		  console.log("Session Service - destroy" + key);
			//$http.get('https://apiserver-rishant.c9users.io/logout/');
			var tmp = sessionStorage.clear();
			return tmp;
			//return sessionStorage.removeItem(key);
		}
	};
}])

.factory('bgGeoService',function($rootScope,sessionService){
	return {
	
	initialize : function(){

	var bgGeo = window.BackgroundGeolocation;

    /**
    * This callback will be executed every time a geolocation is recorded in the background.
    */
    var callbackFn = function(location, taskId) {
        var coords = location.coords;
        var lat    = coords.latitude;
        var lng    = coords.longitude;

        // Simulate doing some extra work with a bogus setTimeout.  This could perhaps be an Ajax request to your server.
        // The point here is that you must execute bgGeo.finish after all asynchronous operations within the callback are complete.
        setTimeout(function() {
          bgGeo.finish(taskId); // <-- execute #finish when your work in callbackFn is complete
        }, 1000);
    };

    var failureFn = function(error) {
        console.log('BackgroundGeoLocation error');
    }

    // BackgroundGeoLocation is highly configurable.
    bgGeo.configure(callbackFn, failureFn, {
        // Geolocation config
        desiredAccuracy: 0,
        stationaryRadius: 3,
        distanceFilter: 10,
        disableElasticity: true, // <-- [iOS] Default is 'false'.  Set true to disable speed-based distanceFilter elasticity
        locationUpdateInterval: 10,
        minimumActivityRecognitionConfidence: 10,   // 0-100%.  Minimum activity-confidence for a state-change 
        fastestLocationUpdateInterval: 5000,
        activityRecognitionInterval: 1,
        stopDetectionDelay: 1,  // Wait x minutes to engage stop-detection system
        stopTimeout: 1,  // Wait x miutes to turn off location system after stop-detection
        activityType: 'AutomotiveNavigation',

        // Application config
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        forceReloadOnLocationChange: false,  // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a new location is recorded (WARNING: possibly distruptive to user) 
        forceReloadOnMotionChange: false,    // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when device changes stationary-state (stationary->moving or vice-versa) --WARNING: possibly distruptive to user) 
        forceReloadOnGeofence: false,        // <-- [Android] If the user closes the app **while location-tracking is started** , reboot app when a geofence crossing occurs --WARNING: possibly distruptive to user) 
        stopOnTerminate: false,              // <-- [Android] Allow the background-service to run headless when user closes the app.
        startOnBoot: true,                   // <-- [Android] Auto start background-service in headless mode when device is powered-up.

        // HTTP / SQLite config
        url: 'https://apiserver-rishant.c9users.io/api/setLocation',
        method: 'POST',
        batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
        autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
        maxDaysToPersist: 1  ,  // <-- Maximum days to persist a location in plugin's SQLite database when HTTP fails
        // headers: {
        //     "X-FOO": "bar"
        // },
         params: {
             "user": sessionService.get('name'),
             "tokens": sessionService.get('wtoken')
         }
       });

	bgGeo.changePace(true);
   
	
	$rootScope.bgGeo = bgGeo;
    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
    // bgGeo.start();

    // If you wish to turn OFF background-tracking, call the #stop method.
    // bgGeo.stop()

		},
	start : function(){
			$rootScope.bgGeo.start();
		},
	stop : function(){
			$rootScope.bgGeo.stop();	
		}
	
		}
})

.factory('postDataService',function($http,sessionService,$q){

	return{
		setStatus:function(status){
			if(!sessionService.get('uid')){
				$location.path('/login');
			}
			else{
				console.log("helo");
				var deferred = $q.defer();
				var promise = deferred.promise;
				promise = $http({
					method : 'POST',
					url　　:   'https://apiserver-rishant.c9users.io/api/updateStatus',
					transformRequest: function(obj) {
            			var str = [];
            			for(var p in obj)
            			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            			return str.join("&");
        				},
        			data:{
        				user:sessionService.get('name'),
        				status:status,
        				token:sessionService.get('wtoken')	
        			},
        			headers:{
        				'Content-Type':'application/x-www-form-urlencoded'}
				});
				promise.then(function(response){
					if(response.data.success){
						// everything is OK
					deferred.resolve('Welcome ');
					console.log(sessionService.get('uid'));
					
					}
					else
					{
						// displsy error 
					$location.path('/login');
			  	    deferred.reject('Wrong credentials.');
					}
				});
				promise.success = function(fn) {
            		promise.then(fn);
            		return promise;
      			}
      			promise.error = function(fn) {
            		promise.then(null, fn);
            		return promise;
      			}
      			return promise;

			}
		},

	getStatus:function(status){
			if(!sessionService.get('uid')){
				$location.path('/login');
			}
			else{
				var deferred = $q.defer();
				var promise = deferred.promise();
				promise = $http({
					method : 'GET',
					url:     'https://apiserver-rishant.c9users.io/api/getStatus'
				});
				promise.then(function(response){
					if(response.data.success){
						// everything is OK
					deferred.resolve(response.data);
					}
					else
					{
						// displsy error 
					$location.path('/login');
			  	    deferred.reject('Wrong credentials.');
					}
				});
				promise.success = function(fn) {
            		promise.then(fn);
            		return promise;
      			}
      			promise.error = function(fn) {
            		promise.then(null, fn);
            		return promise;
      			}
      			return promise;

			}
		}

	}
})
.factory('loginService',function($http, $location, sessionService,$q,bgGeoService,$ionicLoading){
	return{
	  loginCheck:function(){
	    if(!sessionService.get('uid')){
	      $location.path('/login');
	    }
	  },
		login:function(usrnm,pwd){
		  var deferred = $q.defer();
		  var promise = deferred.promise;
		  $ionicLoading.show({
		  	template: '<ion-spinner icon="ripple"></ion-spinner>'+
            		   '<p>Please wait</p>'
		  });
		  promise = $http({
		    method:'POST',
		    url:'https://apiserver-rishant.c9users.io/login',
		    transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
        	},
		    data:{username:usrnm,password:pwd},
		    headers:{
		      'Content-Type':'application/x-www-form-urlencoded'
		    }
		  });
		//promise=$http.post('https://apiserver-rishant.c9users.io/login',data); //send data to user.php
		//	console.log(promise);
			promise.then(function(msg){
			  $ionicLoading.hide();
			  console.log(msg.data);
			  var uid=msg.data.id;
		      if(uid){
				//	scope.msgtxt='Correct information';

				// Setting Sessions and starting tracking after initialiation 

					sessionService.set('uid',uid);
					sessionService.set('name',usrnm);
					sessionService.set('wtoken',msg.data.token);

					bgGeoService.initialize();
					bgGeoService.start();


					deferred.resolve('Welcome ');
					console.log(sessionService.get('uid'));
					$location.path('/tab/dash');
			　}	       
			　else  {
				//	scope.msgtxt='incorrect information';
				$ionicLoading.hide();
				$location.path('/login');
			  	deferred.reject('Wrong credentials.');
				}
			});
			promise.success = function(fn) {
            promise.then(fn);
            return promise;
      }
      promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
      }
      return promise;
							
		},
		logout:function(){
		  console.log("Called logout");
		  $ionicLoading.show({
		  	template: '<ion-spinner icon="ripple"></ion-spinner>'+
            		   '<p>Please wait</p>'
		  });
		  
		  sessionService.destroy('uid');
		  sessionService.destroy('name');
		  sessionService.destroy('wtoken');

		  bgGeoService.stop();
			
		  var deferred = $q.defer();
		  var promise = deferred.promise;
		  promise = $http({
		    method:'GET',
		    url:'https://apiserver-rishant.c9users.io/logout'
		  });
			//promise=$http.post('https://apiserver-rishant.c9users.io/login',data); //send data to user.php
	  	//	console.log(promise);
			promise.then(function(msg){
			  console.log("Check Api msg"+msg.data);
			  $ionicLoading.hide();
				var uid=msg.data.success;
				if(uid){
				//	scope.msgtxt='Correct information';
					//sessionService.set('uid',uid);
					deferred.resolve('Welcome ');
					//console.log(sessionService.get('uid'));
					$location.path('/login');
				}	       
				else  {
				$ionicLoading.hide();	
				//	scope.msgtxt='incorrect information';
				//$location.path('/login');
			  	deferred.reject('Wrong credentials.');
				}
			});
			promise.success = function(fn) {
            promise.then(fn);
            return promise;
      }
      promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
      }
      return promise;
		
			$location.path('/login');
		},
		islogged:function(){
		/*	var $checkSessionServer=$http.get('https://apiserver-rishant.c9users.io/check');
			return $checkSessionServer;*/
			/*
			if(sessionService.get('user')) return true;
			else return false;
			*/
			
		  var deferred = $q.defer();
		  var promise = deferred.promise;
		  promise = $http({
		    method:'GET',
		    url:'https://apiserver-rishant.c9users.io/check'
		  });
			//promise=$http.post('https://apiserver-rishant.c9users.io/login',data); //send data to user.php
		//	console.log(promise);
	  promise.then(function(msg){
			  console.log("Check Api msg"+msg);
				var uid=msg.data.success;
				if(uid){
				//	scope.msgtxt='Correct information';
					//sessionService.set('uid',uid);
					deferred.resolve('Welcome ');
					//console.log(sessionService.get('uid'));
					$location.path('/login');
				}	       
				else  {
				//	scope.msgtxt='incorrect information';
					//$location.path('/login');
			  	deferred.reject('Wrong credentials.');
				}
			});
	  promise.success = function(fn) {
            promise.then(fn);
            return promise;
      }
      promise.error = function(fn) {
            promise.then(null, fn);
            return promise;
      }
      return promise;
		}
	}

});
