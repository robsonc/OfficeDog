//creare a module
var helloApp = angular.module("helloApp", ['ngRoute', 'ngResource', 'ngSanitize', 'angularCharts']);

helloApp.factory('NotesService', ['$resource', function($resource){
    return $resource('/api/notes/:id', {}, { update: { method: 'PUT' }});
}]);

//create a controller
helloApp.controller("indexController", ['$scope', function($scope){
    $scope.config = {
        title: 'Products',
        tooltips: true,
        labels: false,
        mouseover: function() {},
        mouseout: function() {},
        click: function() {},
        legend: {
            display: true,
            //could be 'left, right'
            position: 'right'
        }
    };

    $scope.data = {
        series: ['Sales', 'Income', 'Expense', 'Laptops', 'Keyboards'],
        data: [{
            x: "Laptops",
            y: [100, 500, 0],
            tooltip: "this is tooltip"
        }, {
            x: "Desktops",
            y: [300, 100, 100]
        }, {
            x: "Mobiles",
            y: [351]
        }, {
            x: "Tablets",
            y: [54, 0, 879]
        }]
    };
}]);

helloApp.controller('aboutController', ['$scope', function($scope){
    console.log("About controller");
}]);

helloApp.controller('notesController', ['$scope', 'NotesService', function($scope, NotesService){
    var items = NotesService.query();
    $scope.items = items;
    $scope.submitted = false;
    $scope.addNote = function(){
        if($scope.formNotes.$valid){
            var note = {note: $scope.note};
            NotesService.save(note, function(data){
                $scope.items.push(data);
            });
            $scope.note = "";
        } else {
            $scope.formNotes.submitted = true;
        }
    };
    $scope.refresh = function(){
        $scope.items = NotesService.query();
    };
    $scope.deleteNote = function(note){
        NotesService.delete({id: note._id}, function(){
            console.log("Nota excluida com sucesso!");
            $scope.items.splice($scope.items.indexOf(note), 1);
        });
    }
}]);

//Config routes
helloApp.config(function($routeProvider){
    $routeProvider.when("/", {
        controller: 'indexController',
        templateUrl: 'home.html'
    }).when('/about', {
        controller: 'aboutController',
        templateUrl: 'about.html'
    }).when('/notes', {
        controller: 'notesController',
        templateUrl: 'notes.html'
    });
});
//call views