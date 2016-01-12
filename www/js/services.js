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
.factory('postDataService',function($http,sessionService,$q){


	return{
		setStatus:function(status){
			if(!sessionService.get('uid')){
				$location.path('/login');
			}
			else{
				var deferred = $q.defer();
				var promise = deferred.promise();
				promise = $http({
					method : 'POST',
					url:      'https://apiserver-rishant.c9users.io/api/setStatus',
					transformRequest: function(obj) {
            			var str = [];
            			for(var p in obj)
            			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            			return str.join("&");
        				},
        			data:{
        				username:sessionService.get('name'),
        				status:status},
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
.factory('loginService',function($http, $location, sessionService,$q){
	return{
	  loginCheck:function(){
	    if(!sessionService.get('uid')){
	      $location.path('/login');
	    }
	  },
		login:function(usrnm,pwd){
		  var deferred = $q.defer();
		  var promise = deferred.promise;
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
			  console.log(msg.data);
			  var uid=msg.data.id;
		      if(uid){
				//	scope.msgtxt='Correct information';
					sessionService.set('uid',uid);
					sessionService.set('name',usrnm);
					deferred.resolve('Welcome ');
					console.log(sessionService.get('uid'));
					$location.path('/tab/dash');
			　}	       
			　else  {
				//	scope.msgtxt='incorrect information';
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
			sessionService.destroy('uid');
			
			var deferred = $q.defer();
		  var promise = deferred.promise;
		  promise = $http({
		    method:'GET',
		    url:'https://apiserver-rishant.c9users.io/logout'
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
