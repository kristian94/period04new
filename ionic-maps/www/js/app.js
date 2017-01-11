// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        })
    }).config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('map', {
            url: '/',
            templateUrl: 'templates/map.html',
            controller: 'MapCtrl'
        });

    $urlRouterProvider.otherwise("/");

}).controller('MapCtrl', function ($scope, $state, $cordovaGeolocation, $ionicModal, $http) {
    var options = {timeout: 10000, enableHighAccuracy: true};


    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        // console.log(latLng);

        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
            position: latLng,
            map: $scope.map,
            icon: new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/" + "blue.png"),
            title: "Me"
        });
        var infowindow = new google.maps.InfoWindow({
            content: "Me"
        });
        marker.addListener('click', function () {
            infowindow.open($scope.map, marker);
        });


        //STARTER HER
        $ionicModal.fromTemplateUrl('my-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
        //SLUTTER HER
        $scope.user = {};
        $scope.registerUser = function (user) {
            $scope.modal.hide();
            console.log("1: " + user.userName);
            console.log("2: " + user.distance);
            user.loc = {type: "Point", coordinates: []}; //GeoJSON point
            user.loc.coordinates.push(latLng.lng()); //Observe that longitude comes first
            user.loc.coordinates.push(latLng.lat()); //in GEoJSON
            console.log(JSON.stringify(user));
            $http({
                method: "POST",
                // url: " http://ionicboth-plaul.rhcloud.com/api/friends/register/"+user.distance,
                url: "http://traverse-kristian94.rhcloud.com/api/register/" + user.distance,
                data: user
            }).then(function (response) {
                console.log(response);
                response.data.forEach(function (entry) {
                    var newMarker = new google.maps.Marker({
                        position: new google.maps.LatLng(entry.loc.coordinates.latitude, entry.loc.coordinates.longitude),
                        map: $scope.map,
                        icon: new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/" + "blue.png"),
                        title: entry.username
                    });

                });
            })
        }


    }, function (error) {
        console.log("Could not get location");
    })
});
