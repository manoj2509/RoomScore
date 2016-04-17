angular.module('SimpleRESTIonic.controllers', ['SimpleRESTIonic.services'])
.factory('UserDetails', ['$rootScope', function() {
    authorization = {};
    authorization.firstName = '';
    authorization.lastName = ''; 
    authorization.email = '';
    authorization.id = '';
    return authorization;
}])
.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', 'LoginService', '$state', '$localStorage', '$rootScope', function($scope, $ionicModal, $timeout, LoginService, $state, $localStorage, $rootScope) {
    
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
//    $rootScope.users = UserDetails;
    $rootScope.users = [];
    $scope.signout = function () {
        LoginService.signout()
            .then(function () {
            
//            $rootScope.$broadcast('logout');
            $state.go('login');
            //$state.go($state.current, {}, {reload: true});
        })

    };

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/dashboard.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.$closeApp = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.openApp = function() {
        $scope.modal.show();
    };
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    })  

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
}])
//////
.controller('LoginCtrl', ['$scope', 'Backand', '$state', '$rootScope', 'LoginService', '$ionicModal', '$ionicPopup', 'UserDetails', '$localStorage', function ($scope, Backand, $state, $rootScope, LoginService, $ionicModal, $ionicPopup, UserDetails, $localStorage) {
        
//    $rootScope.users = UserDetails;                      
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.openApp = function() {
        $scope.modal.show();
    };
    
    var login = this;
    function signin() {
        LoginService.signin(login.email, login.password)
            .then(function () {
            onLogin();
        }, function (error) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        })
    }
    
    login.sUp = sUp;
    function sUp() {
        $state.go('signup');
    }
    function anonymousLogin() {
        LoginService.anonymousLogin();
        onLogin('Guest');
    }

    function onLogin(username) {
        $localStorage.email = login.email;
        $localStorage.firstName = login.firstName;
        $localStorage.lastName = login.lastName;
//        console.log($rootScope.users.email);
        $rootScope.$broadcast('authorized');
        $state.go('app.dashboard');
        login.username = username || Backand.getUsername();
    }

    function signout() {
        LoginService.signout()
            .then(function () {
            //$state.go('tab.login');
            $rootScope.$broadcast('logout');
            $state.go($state.current, {}, {reload: true});
        })

    }

    function socialSignIn(provider) {
        LoginService.socialSignIn(provider)
            .then(onValidLogin, onErrorInLogin);

    }

    function socialSignUp(provider) {
        LoginService.socialSignUp(provider)
            .then(onValidLogin, onErrorInLogin);
        
    }

    onValidLogin = function(response){
        onLogin();
        login.username = response.data || login.username;
    }

    onErrorInLogin = function(rejection){
        login.error = rejection.data;
        $rootScope.$broadcast('logout');

    }


    login.username = '';
    login.error = '';
    login.signin = signin;
    login.signout = signout;
    login.anonymousLogin = anonymousLogin;
    login.socialSignup = socialSignUp;
    login.socialSignin = socialSignIn;

}])

.controller('SignUpCtrl', ['$scope', 'Backand', '$state', '$rootScope', 'LoginService', 'UserDetails', '$localStorage', function ($scope, Backand, $state, $rootScope, LoginService, UserDetails, $localStorage) {
    var vm = this;
    $rootScope.users = UserDetails;
    vm.signup = signUp;
    
    function signUp(){
        vm.errorMessage = '';

        LoginService.signup(vm.firstName, vm.lastName, vm.email, vm.password, vm.again)
            .then(function (response) {
            // success
            onLogin();
        }, function (reason) {
            alert('12');
            if(reason.data.error_description !== undefined){
                vm.errorMessage = reason.data.error_description;
            }
            else{
                vm.errorMessage = reason.data;
            }
        });
    }


    function onLogin() {
        $localStorage.email = login.email;
        $localStorage.firstName = login.firstName;
        $localStorage.lastName = login.lastName;
        //$rootScope.$broadcast('authorized');
        $state.go('app.dashboard');
    }


    vm.email = '';
    vm.password ='';
    vm.again = '';
    vm.firstName = '';
    vm.lastName = '';
    vm.errorMessage = '';
}])
/////
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('DashCtrl', ['$scope', 'UserDetails', 'RetreiveRoomService', '$rootScope', '$localStorage', '$state', function($scope, UserDetails, RetreiveRoomService, $rootScope,  $localStorage, $state) {
    $rootScope.users.email = $localStorage.email;
//    console.log($localStorage.email);
    $rootScope.rooms = [];
    $rootScope.user = [];
    var self = this;
    self.check = check();
    function check () {
       console.log('12' + $rootScope.users.email);
        RetreiveRoomService.getUser($localStorage.email).then(function(result) {
            $rootScope.user = result.data.data;
           $localStorage.userID = $rootScope.user[0].id;
           console.log($rootScope.user);
            self.getRooms();
        });
    }
    self.getRooms = function () {
        RetreiveRoomService.getRoomList($localStorage.userID).then(function (result) {
            $rootScope.rooms = result.data.data;
            
        });
    }
    $scope.addRoom = addRoom;
    function addRoom () {
        $state.go('app.roomSetup');
    }
    $scope.deleteRoom = function () {
        allRoomService.deleteRoom(id).then(function (result) {
            getAllRooms();
        })
    }
    
}])
.controller('roomCtrl', ['$rootScope', '$state', function ($rootScope, $state) {
    $rootScope.users.email = $localStorage.email;
    $rootScope.chores = [];
    $rootScope.shopping = [];
    var self = this;
    
    self
}])
.controller('aboutCtrl', function($scope) {

})      
.controller('shoppingListCtrl', function($scope) {

})   
.controller('addListCtrl', function($scope) {

}) 
.controller('choresCtrl', function($scope) {

}) 
.controller('reviewCtrl', function($scope) {

})
.controller('roomSetCtrl', ['$scope', '$state', function ($scope, $state) {
    $scope.temp = '';
    $scope.inputs = [];
    $scope.roomData = [];
    $scope.addField = function (data) {
        $scope.inputs.push({name: data});
    }
    $scope.addARoom = function () {
        allRoomService.addRoom($scope.roomData).then(function (result) {
            $state.go('app.dashboard');
        })
    }
    $scope.cancelRoomSetup = function () {
        $state.go('app.dashboard');
    }
}]);