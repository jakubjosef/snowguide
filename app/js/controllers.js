'use strict';

/* Controllers */

angular.module('snowguide.controllers', []).
  controller('AppCtrl',['$scope',function($scope){
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
                            textState=(marker.state==="open")?"<span class=\"green\">Otevřeno</span>":"<span class=\"red\">Zavřeno</span>",
                            //vytvorime telo infowindow strediska
                            infoContent="<div id=\"MapInfoWindow\">"
                                +"<a class=\"strong\" href=\"#/resort/"+marker._id+"\"><h4>"+marker.name+"</h4></a>"
                                +"<i>"+marker.mountains+"</i><br/>"
                                +marker.snow+"cm sněhu<br/>"
                                +textState
                                +"</div>",
                            infowindow = new google.maps.InfoWindow({position:position,content:infoContent});
                        google.maps.event.addListener(mapMarker,'click',function(){
                           infowindow.open(map,mapMarker);
                        });
                    }
                });
                return map;
                };

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
                  $defer.resolve(cleanData(data));
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
        Resorts.get({resortID:$routeParams.resortID},function(value){
            $scope.resort=value;
            $scope.initStates.resortDetail=true;
        });
    };
    $scope.fillLightbox= function(type){
         $scope.lightboxBody="partials/lightboxes/"+type+".html";
    };
  }])
  .controller('SportCtrl', ['$scope','$routeParams', function($scope,$routeParams) {
  	//sport
  }])
  .controller('MapCtrl',['$scope','$timeout','Resorts','Mountains','usSpinnerService',function($scope,$timeout,Resorts,Mountains,usSpinnerService){
       var mapBarID="MapBar",
            loadMap=function(mapBarID,resortParams){
                 var resortParamsDefaults={
                     mountains:[],
                     artificialSnow:true,
                     nightSkiing:true
                 };
                 angular.extend(resortParams,resortParamsDefaults);
                 resortParams.mountains=JSON.stringify(resortParams.mountains);
                 usSpinnerService.spin("spinner-1");
                    $scope.mapLoading=true;
                    Resorts.byMountains(resortParams,function(data){
                         $scope.map=$scope.initMap(mapBarID,cleanData(data));
                         usSpinnerService.stop("spinner-1");
                         $scope.mapLoading=false;
                     });
             };
       $scope.mapLoading=true;
       $scope.artificialSnow=true;
       $scope.nightSkiing=true;
       $scope.$watch('selectedMountain',function(newVal,oldVal){
           if(newVal!==oldVal){
               loadMap(mapBarID,{mountains:newVal,artificialSnow:$scope.artificialSnow,nightSkiing:$scope.nightSkiing});
           }
        });
        $scope.firstLoadMap=function(){
            Resorts.favorite(function(resorts){
                $scope.map=$scope.initMap(mapBarID,cleanData(resorts));
                usSpinnerService.stop("spinner-1");
                $scope.mapLoading=false;
            });
        };
        Mountains.query(function(data){
            $scope.mountains=cleanData(data);
            $timeout(function(){
                $scope.initChosen();
            },200);
        });
  }])
  .controller('CntCtrl',['$scope',function($scope){
  	//contact
        $scope.requestResort=function(){
            alert(angular.toJson($scope.resortRequest));
        };
  }]);
function cleanData($resourceDataObject){
    delete $resourceDataObject.$promise;
    delete $resourceDataObject.$resolved;
    return $resourceDataObject;
}