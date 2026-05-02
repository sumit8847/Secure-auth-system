/*
 * ============================================================
 *  B.Tech Assignment - Secure User Authentication System
 *  Frontend: AngularJS
 *  File: authService.js  (Authentication Service)
 * ============================================================
 *
 *  AngularJS Services are singleton objects that can be
 *  injected into any controller. This service handles:
 *   1. Sending login request to the backend
 *   2. Storing the JWT token in localStorage
 *   3. Checking if the user is logged in
 *   4. Retrieving the stored username
 *   5. Logging out (clearing the token)
 * ============================================================
 */

// We add this service to our existing 'authApp' module
app.service('AuthService', function ($http) {

    // ── Key names used in localStorage ────────────────────────
    var TOKEN_KEY    = 'auth_token';
    var USERNAME_KEY = 'auth_username';

    // Backend API base URL
    var API_URL = 'http://localhost:3000';


    // ════════════════════════════════════════════════════════
    //  METHOD: login(credentials)
    //  Sends POST request to /api/login
    //  On success: saves token + username to localStorage
    //  Returns   : a Promise (so controller can use .then/.catch)
    // ════════════════════════════════════════════════════════
    this.login = function (credentials) {

        var promise = $http.post(API_URL + '/api/login', credentials);

        // Attach a .then() here to save token before
        // the controller's .then() runs
        promise.then(function (response) {
            if (response.data.token) {
                // Save JWT token to localStorage
                localStorage.setItem(TOKEN_KEY, response.data.token);

                // Save username for display in dashboard
                localStorage.setItem(USERNAME_KEY, credentials.username);
            }
        });

        // Return the promise so the controller can
        // also attach .then() and .catch()
        return promise;
    };


    // ════════════════════════════════════════════════════════
    //  METHOD: logout()
    //  Removes token and username from localStorage
    // ════════════════════════════════════════════════════════
    this.logout = function () {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USERNAME_KEY);
    };


    // ════════════════════════════════════════════════════════
    //  METHOD: getToken()
    //  Returns the stored JWT token (or null if not logged in)
    // ════════════════════════════════════════════════════════
    this.getToken = function () {
        return localStorage.getItem(TOKEN_KEY);
    };


    // ════════════════════════════════════════════════════════
    //  METHOD: isLoggedIn()
    //  Returns true if a token exists in localStorage
    //  Used by route resolver to guard the dashboard
    // ════════════════════════════════════════════════════════
    this.isLoggedIn = function () {
        var token = localStorage.getItem(TOKEN_KEY);
        return token !== null && token !== '';
    };


    // ════════════════════════════════════════════════════════
    //  METHOD: getUsername()
    //  Returns the stored username for display purposes
    // ════════════════════════════════════════════════════════
    this.getUsername = function () {
        return localStorage.getItem(USERNAME_KEY) || 'User';
    };

});
