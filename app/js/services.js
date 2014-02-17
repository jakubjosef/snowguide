'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('snowguide.services', []).
  value('version', '0.0.9').
  factory('Resorts',['$resource',function($resource){
  	return $resource('api/resorts/:resortID',
		{ resortID: '@resortID',
                  mountains: '@mountains',
                  favoriteSkiResorts:'@favoriteSkiResorts',
                  favoriteSkiRaces:'@favoriteSkiRaces',
                  favoriteSnbResorts:'@favoriteSnbResorts',
                  favoriteSnbParks:'@favoriteSnbParks',
                  favoriteCCSkiResorts:'@favoriteCCSkiResorts',
                  favoriteCCSkiKidResorts:'@favoriteCCSkiKidResorts'
                },{
                    favorite:{
                        method:'GET',
                        params:{
                            favorite:true,
                            favoriteSkiResorts:'@favoriteSkiResorts',
                            favoriteSkiRaces:'@favoriteSkiRaces',
                            favoriteSnbResorts:'@favoriteSnbResorts',
                            favoriteSnbParks:'@favoriteSnbParks',
                            favoriteCCSkiResorts:'@favoriteCCSkiResorts',
                            favoriteCCSkiKidResorts:'@favoriteCCSkiKidResorts'
                        },
                        isArray:true
                    },
                    byMountains:{
                        method:'GET',
                        params:{mountains:'@mountains'},
                        isArray:true
                    },
                    testDB:{
                        method:'GET',
                        params:{testDB:true}
                    }


          });
  }]).
  factory('Mountains',['$resource',function($resource){
        return $resource('api/mountains');
  }]);
