/*
 * ============================================================
 *  B.Tech Assignment - Secure User Authentication System
 *  Frontend: AngularJS
 *  File: app.js  (Main Application Module + Routing)
 * ============================================================
 *
 *  This is the main entry point of our AngularJS application.
 *  It does three things:
 *   1. Defines the app module and its dependencies
 *   2. Configures client-side routes (login / dashboard)
 *   3. Protects the dashboard route using a route resolver
 * ============================================================
 */

// ── Step 1: Create the AngularJS module ───────────────────────
// We depend on:
//   ngRoute   → for client-side routing ($routeProvider)
//   ngResource → (optional, using $http is fine too)
var app = angular.module('authApp', ['ngRoute']);


// ════════════════════════════════════════════════════════════════
//  ROUTE CONFIGURATION
//  $routeProvider lets us map URLs to HTML templates + controllers
// ════════════════════════════════════════════════════════════════
app.config(function ($routeProvider, $locationProvider) {

    $routeProvider

        // ── Route 1: Login Page (/login) ──────────────────────
        .when('/login', {
            templateUrl : 'login.html',
            controller  : 'LoginController'
        })

        // ── Route 2: Dashboard Page (/dashboard) ──────────────
        // We use a "resolve" to check authentication BEFORE
        // the dashboard template is loaded. If user is not
        // logged in, we redirect them to /login.
        .when('/dashboard', {
            templateUrl : 'dashboard.html',
            controller  : 'DashboardController',
            resolve: {
                // "authCheck" runs before the route loads
                authCheck: function ($location, AuthService) {
                    if (!AuthService.isLoggedIn()) {
                        // Not logged in → go back to login
                        $location.path('/login');
                    }
                }
            }
        })

        // ── Default Route: redirect to /login ─────────────────
        .otherwise({
            redirectTo: '/login'
        });

    // Use hash-based URLs: http://localhost/index.html#/login
    // This works without any server-side configuration.
    // $locationProvider.hashPrefix('!'); // optional
});


// ════════════════════════════════════════════════════════════════
//  LOGIN CONTROLLER
//  Handles: form submission, API call, token storage, redirects
// ════════════════════════════════════════════════════════════════
app.controller('LoginController', function ($scope, $location, AuthService) {

    // Model bound to the login form fields
    $scope.credentials = { username: '', password: '' };
    $scope.errorMessage   = '';
    $scope.successMessage = '';
    $scope.isLoading      = false;

    // If user is already logged in, skip login page
    if (AuthService.isLoggedIn()) {
        $location.path('/dashboard');
    }

    // ── Called when user clicks "Login" button ─────────────────
    $scope.login = function () {

        // Clear previous messages
        $scope.errorMessage   = '';
        $scope.successMessage = '';
        $scope.isLoading      = true;

        // Call AuthService to send credentials to backend
        AuthService.login($scope.credentials)

            .then(function (response) {
                // ✅ Login successful
                $scope.isLoading      = false;
                $scope.successMessage = response.data.message;

                // Wait a moment so user sees success message, then redirect
                setTimeout(function () {
                    $scope.$apply(function () {
                        $location.path('/dashboard');
                    });
                }, 1000);
            })

            .catch(function (error) {
                // ❌ Login failed
                $scope.isLoading    = false;
                $scope.errorMessage = error.data
                    ? error.data.message
                    : 'Server error. Please try again.';
            });
    };
});


// ════════════════════════════════════════════════════════════════
//  DASHBOARD CONTROLLER
//  Handles: loading protected data, displaying user info, logout
// ════════════════════════════════════════════════════════════════
app.controller('DashboardController', function ($scope, $location, $http, AuthService) {

    $scope.dashboardData = null;
    $scope.loadError     = '';
    $scope.currentUser   = AuthService.getUsername();

    // ── Fetch protected data from backend ─────────────────────
    // The HTTP interceptor (interceptor.js) will automatically
    // attach the JWT token to this request.
    $http.get('http://localhost:3000/api/dashboard')

        .then(function (response) {
            $scope.dashboardData = response.data.data;
        })

        .catch(function (error) {
            $scope.loadError = 'Failed to load dashboard data. Token may have expired.';
        });

    // ── Logout function ────────────────────────────────────────
    $scope.logout = function () {
        AuthService.logout();      // Clear token from localStorage
        $location.path('/login');  // Redirect to login page
    };
});
