'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('snowguide.services', []).
  value('version', '0.0.7').
  factory('Resorts',['$resource',function($resource){
  	return $resource('api/resorts/:resortID',
		{ resortID: '@resortID'},{
                    favorite:{
                        method:'GET',
                        params:{favorite:true},
                        isArray:true
                    }
		});
  }]).
  factory('Mountains',['$resource',function($resource){
        return $resource('api/mountains');
  }]);
