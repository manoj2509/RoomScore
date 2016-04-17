// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('SimpleRESTIonic', ['ionic', 'backand', 'SimpleRESTIonic.controllers', 'SimpleRESTIonic.services', 'ngStorage'])


.run(function($ionicPlatform, $rootScope, $state, LoginService, Backand) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
        var isMobile = !(ionic.Platform.platforms[0] == "browser");
        Backand.setIsMobile(isMobile);
        Backand.setRunSignupAfterErrorInSigninSocial(true);      
    });
    function unauthorized() {
        console.log("user is unauthorized, sending to login");
        $state.go('tab.login');
    }

    function signout() {
        LoginService.signout();
    }

    $rootScope.$on('unauthorized', function () {
        unauthorized();
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        if (toState.name == 'tab.login') {
            signout();
        }
        else if (toState.name != 'tab.login' && Backand.getToken() === undefined) {
            unauthorized();
        }
    });
})

.config(function(BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
    BackandProvider.setAppName('broncohack');
    BackandProvider.setSignUpToken('f186eae0-9c57-44cf-b9a4-dbe2014ee805');

    // token is for anonymous login. see http://docs.backand.com/en/latest/apidocs/security/index.html#anonymous-access
    BackandProvider.setAnonymousToken('7bf5a06e-8ec5-42ab-a2c9-9c94712132f2');
    $stateProvider
    
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })
    .state('app.about', {
        url: '/About Us',
        views: {
            'menuContent': {
                templateUrl: 'templates/about.html',
                controller: 'aboutCtrl'
            }
        }
    })
    .state('app.settings', {
        url: '/Profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/Settings.html',
                controller: 'settingsCtrl'
            }
        }
    })
    .state('app.shoppingList', {
        url: '/shopping',
        views: {
            'menuContent': {
                templateUrl: 'templates/shoppingList.html',
                controller: 'shoppingListCtrl'
            }
        }
    })
    .state('app.dashboard', {
        url: '/Quickview',
        views: {
            'menuContent': {
                templateUrl: 'templates/dashboard.html',
                controller: 'DashCtrl'
            }
            
        }
    })
    .state('app.addList', {
        url: '/addList',
        views: {
            'menuContent': {
                templateUrl: 'templates/addList.html',
                controller: 'addListCtrl'
            }
        }
    })
    .state('app.review', {
        url: '/review',
        views: {
            'menuContent': {
                templateUrl: 'templates/review.html',
                controller: 'reviewCtrl'
            }
        }
    })
    .state('app.chores', {
        url: '/chores',
        views: {
            'menuContent': {
                templateUrl: 'templates/chores.html',
                controller: 'choresCtrl'
            }
        }
    })
    .state('app.roomboard', {
        url: '/rooms',
        view: {
            'menuContent': {
                templateUrl: 'template/roomboard.html',
                controller: 'RoomCtrl'
            }
        }
    })
    .state('app.roomSetup', {
        url: '/New Room',
        views: {
            'menuContent': {
                templateUrl: 'templates/roomSetup.html',
                controller: 'roomSetCtrl'
            }
        }
    })
    .state('signup', {
        url: '/signup',
        views: {
            '': {
                templateUrl: 'templates/signup.html',
                controller: 'SignUpCtrl as vm'
            }
        }
    })
    .state('login', {
        url: '/login',
        views: {
            '': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl as login'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
    $httpProvider.interceptors.push('APIInterceptor');
});
