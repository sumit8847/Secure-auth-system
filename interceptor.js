/*
 * ============================================================
 *  B.Tech Assignment - Secure User Authentication System
 *  Frontend: AngularJS
 *  File: interceptor.js  (HTTP Interceptor)
 * ============================================================
 *
 *  An HTTP Interceptor in AngularJS lets us "intercept"
 *  every HTTP request BEFORE it is sent to the server.
 *
 *  Our interceptor does one job:
 *    → If a JWT token is stored in localStorage,
 *      automatically attach it to the Authorization header
 *      of every request going to /api/* URLs.
 *
 *  This way, controllers don't need to manually add
 *  the token to every single $http call.
 * ============================================================
 */

// ── Define the interceptor as a factory ───────────────────────
app.factory('AuthInterceptor', function () {

    return {

        // ── request(config) ────────────────────────────────────
        // This function runs BEFORE every HTTP request is sent.
        // 'config' contains all request details (url, headers, etc.)
        request: function (config) {

            // Only add the token for our own API requests
            // This avoids sending our token to external URLs
            if (config.url.indexOf('/api/') !== -1) {

                // Get the token from localStorage
                var token = localStorage.getItem('auth_token');

                if (token) {
                    // Attach token in Authorization header
                    // Format: "Bearer <token>"  (standard JWT convention)
                    config.headers['Authorization'] = 'Bearer ' + token;
                }
            }

            // Always return the config object (modified or not)
            return config;
        },

        // ── responseError(rejection) ───────────────────────────
        // This runs if any HTTP response comes back with an error.
        // We handle 401 (Unauthorized) specifically.
        responseError: function (rejection) {

            if (rejection.status === 401 || rejection.status === 403) {
                // Token expired or invalid → clear it from storage
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_username');

                // You could also redirect to /login here if needed
                // But we let the controller handle the UI message
            }

            // Re-throw the rejection so .catch() in controllers still works
            return Promise.reject(rejection);
        }
    };
});


// ── Register the interceptor with AngularJS's $http service ───
// Without this step, the factory above won't actually do anything.
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});
