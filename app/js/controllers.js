'use strict';

/* Controllers */

angular.module('snowguide.controllers', []).
  controller('AppCtrl',['$scope','$rootScope','$http','$location','$anchorScroll','user',function($scope,$rootScope,$http,$location,$anchorScroll,user){
            		$.pnotify.defaults.history = false;
                $scope.pages=[
            			{url:"home",name:"Domů",style:1},
            			{url:"sport",name:"Naše tipy",style:2},
            			{url:"resorts",name:"Střediska",style:3},
            			{url:"map",name:"Mapa",style:5},
            			{url:"contact",name:"Kontakt",style:4}
            		];
                $scope.initChosen=function(reinit){
                    var config = {
                        '.chosen-select'           : {},
                        '.chosen-select-deselect'  : {allow_single_deselect:true},
                        '.chosen-select-no-single' : {disable_search_threshold:10},
                        '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
                        '.chosen-select-width'     : {width:"95%"}
                    };
                    for (var selector in config) {
                      if(reinit){
                        $(selector).trigger("chosen:updated");
                      }else{
                        $(selector).chosen(config[selector]);
                      }
                    }
                };
                $scope.initMap=function(mapBarID,markers){
                    var mapOptions={
                    zoom: 8,
                    center: new google.maps.LatLng(50,15),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(document.getElementById(mapBarID),mapOptions);
                angular.forEach(markers,function(marker){
                    if(marker.hasOwnProperty("lat") && marker.hasOwnProperty("lng")){
                        var position=new google.maps.LatLng(marker.lat,marker.lng),
                            mapMarker = new google.maps.Marker({map:map,position:position}),
                            //vytvorime telo infowindow strediska
                            textState=(marker.state==="open")?"<h5 class=\"green\">Otevřeno</h5>":"<h5 class=\"red\">Zavřeno</h5>",
                            addionalServices=(marker.artificialSnow)?(marker.nightSkiing)?"Umělé zasněžování<br/>Večerní lyžování":"Umělé zasněžování":(marker.nightSkiing)?"Večerní lyžování":"",
                            infoContent="<div id=\"MapInfoWindow\">"
                                +"<a class=\"strong\" href=\"#/resort/"+marker._id+"\"><h4>"+marker.name+"</h4></a>"
                                +"<i>"+marker.mountains+"</i><br/>"
                                +marker.snow+"cm sněhu<br/>"
                                +textState
                                +addionalServices
                                +"</div>",
                            infowindow = new google.maps.InfoWindow({position:position,content:infoContent});
                        google.maps.event.addListener(mapMarker,'click',function(){
                           infowindow.open(map,mapMarker);
                        });
                    }
                });
                return map;
                };
                $scope.scrollTo=function(anchor){
                   anchor=anchor||"";
                   $location.hash(anchor);
                   $anchorScroll();
                };

                $http.get('api/test').error(function(){
                   $scope.noDBConnection=true;
                });
                //login handling
                $rootScope.$on('user.login', function() {
                   $.pnotify({
                      title: 'Uživatel přihlášen',
                      text: 'Uživatel '+user.current.login+' byl úspěšně přihlášen',
                      type: 'success'
                   });
                });
                //logout handling
                $rootScope.$on('user.logout',function(){
                  $location.path("");
                  $.pnotify({
                      title: 'Uživatel odhlášen',
                      text: 'Odhlášení proběhlo úspěšně',
                      type: 'success'
                   });
                });
  }])
  .controller('HomeCtrl', ['$scope','Resorts',function($scope,Resorts) {
  	//home
        $scope.favoriteResorts=Resorts.favorite();
  }])
  .controller('ResortsCtrl',['$scope','$timeout','Resorts','ngTableParams','$routeParams','usSpinnerService',function($scope,$timeout,Resorts,ngTableParams,$routeParams,usSpinnerService){
     $scope.lightboxBody="";
     $scope.initStates={resortDetail: false,resortsTable:false};
     $scope.initResortsTable = function(){
        $scope.tableParams=new ngTableParams({
            sorting:{
              name:'asc'
            }
        },{
           groupBy:'mountains',
           counts: [], // hide page counts control
           total:0,
           getData:function($defer,params){
             Resorts.query(params.url(),function(data){
                $timeout(function(){
                  $defer.resolve(cleanResourceData(data));
                },50);
             });
           }
        });
        $scope.$watch('tableParams.settings().$loading',function(value){
            if(value){
                usSpinnerService.spin("spinner-1");
            }else{
                usSpinnerService.stop("spinner-1");
            }
        });
    };
    $scope.initResortDetail=function(){
        $scope.carouselInterval=5000;
        Resorts.get({id:$routeParams.resortID},function(value){
            $scope.resort=value;
            $scope.initStates.resortDetail=true;
        });
    };
    $scope.fillLightbox= function(type){
         $scope.lightboxBody="partials/lightboxes/"+type+".html";
    };
    $scope.removeProtocolFromURL=function(url){
        return url && url.replace(/^http:\/\//, '');
    };
  }])
  .controller('SportCtrl', ['$scope','$routeParams','Resorts', function($scope,$routeParams,Resorts) {

       $scope.initFavoriteResorts=function(){
            if(typeof $routeParams.sportType === "string"){
                 $scope.scrollTo($routeParams.sportType);

             }
             Resorts.favorite({favoriteSkiResorts:true},function(data){
                $scope.favoriteSkiResorts=cleanResourceData(data);
             });
             Resorts.favorite({favoriteSkiRaces:true},function(data){
                $scope.favoriteSkiRaces=cleanResourceData(data);
             });
             Resorts.favorite({favoriteSnbResorts:true},function(data){
                $scope.favoriteSnbResorts=cleanResourceData(data);
             });
             Resorts.favorite({favoriteSnbParks:true},function(data){
                $scope.favoriteSnbParks=cleanResourceData(data);
             });
             Resorts.favorite({favoriteCCSkiResorts:true},function(data){
                $scope.favoriteCCSkiResorts=cleanResourceData(data);
             });
             Resorts.favorite({favoriteCCSkiKidResorts:true},function(data){
                $scope.favoriteCCSkiKidResorts=cleanResourceData(data);
             });
       };
  }])
  .controller('MapCtrl',['$scope','$timeout','Resorts','Mountains','usSpinnerService','$window',function($scope,$timeout,Resorts,Mountains,usSpinnerService,$window){
       var mapBarID="MapBar",
            loadMap=function(mapBarID,mapParams){
                 var resortParams={
                     mountains:[],
                     artificialSnow:null,
                     nightSkiing:null
                 };
                 angular.extend(resortParams,mapParams);
                 resortParams.mountains=JSON.stringify(resortParams.mountains);
                 usSpinnerService.spin("spinner-1");
                 $scope.mapLoading=true;
                 Resorts.byMountains(resortParams,function(data){
                     $scope.map=$scope.initMap(mapBarID,cleanResourceData(data));
                     usSpinnerService.stop("spinner-1");
                     $scope.mapLoading=false;
                     if(!$scope.showCheckboxes){
                        $scope.showCheckboxes=true;
                     }
                 });

             };
       $scope.showCheckboxes=false;
       $scope.mapLoading=true;
       $scope.artificialSnow=true;
       $scope.nightSkiing=true;
       $scope.$watch('selectedMountains',function(newVal,oldVal){
           if(newVal!==oldVal){
               if((!(newVal instanceof Array)) || newVal.length===0){
                   usSpinnerService.spin("spinner-1");
                   $scope.firstLoadMap();
                   $scope.showCheckboxes=false;
               }else{
                  loadMap(mapBarID,{mountains:newVal,artificialSnow:$scope.artificialSnow,nightSkiing:$scope.nightSkiing});
               }
           }
        });
        $scope.$watch('artificialSnow',function(newVal,oldVal){
           if(newVal!==oldVal && $scope.selectedMountains){
               loadMap(mapBarID,{mountains:$scope.selectedMountains,artificialSnow:newVal,nightSkiing:$scope.nightSkiing});
           }
        });
        $scope.$watch('nightSkiing',function(newVal,oldVal){
            if(newVal!==oldVal && $scope.selectedMountains){
               loadMap(mapBarID,{mountains:$scope.selectedMountains,artificialSnow:newVal,nightSkiing:newVal});
            }
        });
        $scope.firstLoadMap=function(){
            Resorts.favorite(function(resorts){
                $scope.map=$scope.initMap(mapBarID,cleanResourceData(resorts));
                usSpinnerService.stop("spinner-1");
                $scope.mapLoading=false;
            });
        };
        //watch to Google Maps api load, then first init map
        $scope.$watch(function(){
            return $window.mapsApiLoaded;
        },function(apiState){
            if(apiState===true){
                $scope.firstLoadMap();
            }
        });
        Mountains.query(function(data){
            $scope.mountains=cleanResourceData(data);
            $timeout(function(){
                $scope.initChosen();
            },200);
        });
  }])
  .controller('CntCtrl',['$scope',function($scope){
  	//contact
        $scope.requestResort=function(){
            $scope.resortRequested=true;
            //alert('');
            //alert(angular.toJson($scope.resortRequest));
        };
  }]).
  controller('AdminCtrl',['$scope','$rootScope','$location','$window','Resorts','Mountains','user','usSpinnerService',function($scope,$rootScope,$location,$window,Resorts,Mountains,user,usSpinnerService){
      var initFunctions={
          resorts: function(noClearForm){
            var params={"sorting[name]":"desc",plain:true};
            if(user.current.authenticated){
                params.provider=user.current.user_id;
            }
            Resorts.query(params,function(data){
              $scope.resorts=cleanResourceData(data);
              if(!noClearForm){
                $scope.clearForm();
              }
            });
          },
          mountains: function(noClearForm){
            var params={};
            if(user.current.authenticated){
                params.provider=user.current.user_id;
            }
            Mountains.query(function(data){
              $scope.mountains=cleanResourceData(data);
              if(!noClearForm){
                $scope.clearForm();
              }
            });
          }
      },
      checkPermissions=function(permission,successFn,errorFn){
        // check permissions
           UserApp.User.hasPermission({
                 user_id: "self",
                 permission: [permission]
                 }, function(error, result){
                 if (result.missing_permissions.length > 0) {
                     if(typeof errorFn === 'function'){
                         errorFn(error);
                     }
                 } else {
                     if(typeof successFn === 'function'){
                         successFn();
                     }
                 }
           });
      }
      ;
      if(user.current.authenticated){
        $location.path("admin/index");
      }
      $scope.showUsersTab=false;
      $scope.fillTab=function(tabName){
          if(typeof tabName === 'undefined'){
              alert('fillTab: tabName is undefined!');
          }
          checkPermissions("admin",function(){
                  $scope.$apply(function(){
                     $scope.userLevel="admin";
                     initFunctions[tabName]();
                     $scope.adminInited=true;
                     $scope.firstTabHeading="Všechna střediska";
                     $scope.showUsersTab=true;
                  });
              },
              function(){
                    $scope.userLevel="user";
                    initFunctions[tabName]();
                    $scope.adminInited=true;
                    $scope.firstTabHeading="Moje střediska";
                  });
      };
      $scope.clearForm = function(){
          $scope.editingObject={};
      };
      $scope.add=function(type){
          var addFn=function(response){
            $scope.editingObject={_id:response._id};
            if(user.current.authenticated && !isAdmin(user.current)){
                $scope.editingObject.provider=user.current.user_id;
            }
          };
          eval(type.capitalize()+".nextId({},addFn)");
      };
      $scope.edit=function(data){
        $scope.editingObject=cleanObject(data);
      };
      $scope.save=function(type,data){
        var successFn=function(response){
              if(response.ok!==1){
                  return failFn();
              }
              alert('Uloženo');
              initFunctions[type](true);
              usSpinnerService.stop("spinner-1");
              $scope.formLoading=false;
            },
            failFn=function(){
              alert('Došlo k chybě při uložení');
              usSpinnerService.stop("spinner-1");
              $scope.formLoading=false;
            };
         if(user.current.authenticated){
             data.provider=user.current.user_id;
         }
        $scope.formLoading=true;
        usSpinnerService.spin("spinner-1");
        //call save api function from service depending on type
        eval(type.capitalize()+".save({id:data._id},data,successFn,failFn);");
      };
      $scope.switchPage=function(page){
          $scope.usersPage="partials/admin/"+page+".html";
      };
  }]);
function cleanResourceData($resourceDataObject){
    delete $resourceDataObject.$promise;
    delete $resourceDataObject.$resolved;
    return $resourceDataObject;
}
function cleanObject($object){
  var returnObject={};
  for (var property in $object){
    if(property.charAt(0)!=='$'){
      returnObject[property]=$object[property];
    }
  }
  return returnObject;
}
function mapsApiLoaded(){
    window.mapsApiLoaded=true;
}
function isAdmin(user){
    return user.permissions.admin.value;
}
