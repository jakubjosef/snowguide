'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('snowguide.services', []).
  value('version', '0.1.1').
  factory('Resorts',['$resource',function($resource){
  	return $resource('api/resorts/:id',
		            { id: '@id',
                  mountains: '@mountains',
                  data: '@data',
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
                    nextId:{
                        method:'GET',
                        params:{nextId:true}
                    }
          });
  }]).
  factory('Mountains',['$resource',function($resource){
        return $resource('api/mountains/:id',{
                id:'@id'
            },
            {
                nextId:{
                        method:'GET',
                        params:{nextId:true}
                    }
            });
  }]);
