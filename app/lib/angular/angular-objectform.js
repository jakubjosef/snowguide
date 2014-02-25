/*
    Directive for easy creating and editing JS objects
    Jakub Josef
*/
angular.module("angular-objectForm",[]).
directive('objectForm',['$compile',function($compile){
    return {
        restrict : 'E',
        scope: {
            'object': '=',
            'onSave': '&',
            'protectedProperty':'@'
        },
        template: '<table id="ObjectForm"><tr data-ng-repeat="property in parsedObject" id="ObjectFormProperty_{{property.name}}">'
                            +'<td><label>{{property.name}}</label></td>'
                            +'<td><input class="form-control" type="text" data-ng-model="formData[property.name]" name="{{property.name}}" data-ng-disabled="{{isProtectedProperty(property.name)}}"/></td><td>&nbsp;<a data-ng-hide="{{isProtectedProperty(property.name)}}" href="" data-ng-click="removeFormProperty(property.name)"><i class="glyphicon glyphicon-remove"></i></a></td>'
                            +'</tr><tr class="last"><td colspan="3">&nbsp;</td></tr>'
                            +'<tr data-ng-show="parsedObject">'
                            +'<td><input class="form-control" type="text" placeholder="key" data-ng-model="key"/></td>'
                            +'<td><input class="form-control" type="text" placeholder="value" data-ng-model="val"/></td></tr>'
                            +'<tr><td colspan="2"><button data-ng-show="parsedObject" data-ng-click="addFormProperty()" class="btn btn-default btn-large btn-block">Přidat vlastnost</button></tr>'
                            +'<tr><td colspan="2">&nbsp;</td></tr><tr><td>&nbsp;</td><td><button class="btn btn-default btn-block" data-ng-show="parsedObject" data-ng-click="submitHandler(formData)">Uložit</button></td></tr></table>',
        link:function(scope,element,attrs){
            var $form=angular.element("table#ObjectForm"),
                createDynamicFormData =function (data,type){
                    var returnArray=[];
                    for(var name in data){
                        returnArray.push({
                            name: name,
                            value:data[name]
                        });
                    }
                    return returnArray;
                },
                getPropertyHTML=function(key,val){
                    return '<tr class="generated" id="ObjectFormProperty_'+key+'"><td><label>'+key+'</label></td><td><input class="form-control" type="text" value="'+val+'"/></td><td>&nbsp;<a href="" data-ng-click="removeFormProperty(\''+key+'\')"><i class="glyphicon glyphicon-remove"></i></a></td></tr>';
                };
            scope.isProtectedProperty = function(propertyName){
                if(scope.protectedProperty.indexOf(",")!==-1){
                    //is array
                    var protectedProperty=scope.protectedProperty.split(",");
                    return ($.inArray(propertyName,protectedProperty)!== -1);
                }else{
                    return propertyName===scope.protectedProperty;
                }

            };
            scope.$watch('object',function(newVal){
                newVal && scope.initObjectForm(newVal);
            });
            scope.submitHandler=function(){
                scope.onSave({data:scope.formData});
            };
            scope.addFormProperty=function(){
                if(scope.key && scope.val){
                    $form.find("tr.last").before($compile(getPropertyHTML(scope.key,scope.val))(scope));
                    scope.formData[scope.key]=scope.val;
                    scope.key=scope.val="";
                }
            };
            scope.removeFormProperty=function(propertyName){
                $form.find("tr#ObjectFormProperty_"+propertyName).remove();
                delete scope.formData[propertyName];
            };
            scope.initObjectForm=function(data){
                scope.parsedObject=createDynamicFormData(data,'string');
                scope.formData=data;
                $form.find("tr.generated").remove();
            };
        }
    };
}]);