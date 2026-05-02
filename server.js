/*
 * ============================================================
 *  B.Tech Assignment - Secure User Authentication System
 *  Backend: Node.js + Express + JWT
 *  File: server.js
 * ============================================================
 *
 *  What this file does:
 *  1. Creates an Express web server
 *  2. Exposes POST /api/login   → validates credentials, returns JWT
 *  3. Exposes GET  /api/dashboard → protected route, verifies JWT
 *  4. Uses CORS so our AngularJS frontend can talk to this server
 * ============================================================
 */

// ── Step 1: Import required packages ──────────────────────────
const express = require('express');   // Web framework
const jwt     = require('jsonwebtoken'); // For creating/verifying JWT tokens
const cors    = require('cors');      // Allows cross-origin requests from frontend

// ── Step 2: Create the Express application ────────────────────
const app  = express();
const PORT = 3000; // Server will run on http://localhost:3000

// ── Step 3: Secret key used to sign JWT tokens ────────────────
// In a real project this should be in a .env file, but for the
// assignment we keep it here so it's easy to understand.
const JWT_SECRET = 'mySecretKey_btech2024';

// ── Step 4: Middleware setup ───────────────────────────────────
app.use(cors());                       // Allow requests from AngularJS frontend
app.use(express.json());               // Parse incoming JSON request bodies

// ── Step 5: Sample user database (hardcoded for assignment) ───
// In a real application this would come from a database like MongoDB.
const USERS = [
    { id: 1, username: 'admin', password: '1234' }
];

// ════════════════════════════════════════════════════════════════
//  ROUTE 1: POST /api/login
//  Purpose : Validate username & password, return a JWT token
// ════════════════════════════════════════════════════════════════
app.post('/api/login', (req, res) => {

    // Extract username and password from the request body
    const { username, password } = req.body;

    // Basic validation – make sure fields are not empty
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required.'
        });
    }

    // Check if the user exists in our sample database
    const user = USERS.find(
        u => u.username === username && u.password === password
    );

    // If user not found, send 401 Unauthorized
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials. Please try again.'
        });
    }

    // ── Create JWT Token ───────────────────────────────────────
    // jwt.sign(payload, secret, options)
    //   payload  : data we want to store inside the token
    //   secret   : our secret key to sign the token
    //   expiresIn: token will expire after 1 hour
    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Send back the token and a success message
    return res.status(200).json({
        success: true,
        message: 'Login successful! Welcome, ' + user.username + '.',
        token: token
    });
});

// ════════════════════════════════════════════════════════════════
//  MIDDLEWARE: verifyToken
//  Purpose   : Reusable function to protect routes
//              Checks if a valid JWT is present in the header
// ════════════════════════════════════════════════════════════════
function verifyToken(req, res, next) {

    // The token is sent in the Authorization header as:
    //   Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    // Split "Bearer <token>" and grab just the token part
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Token format is invalid.'
        });
    }

    // Verify the token using our secret key
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid or has expired. Please login again.'
            });
        }

        // Token is valid – attach user info to request object
        req.user = decoded;

        // Call next() to proceed to the actual route handler
        next();
    });
}

// ════════════════════════════════════════════════════════════════
//  ROUTE 2: GET /api/dashboard
//  Purpose : Protected route – only accessible with valid JWT
// ════════════════════════════════════════════════════════════════
app.get('/api/dashboard', verifyToken, (req, res) => {

    // If we reach here, the token was valid.
    // req.user contains the decoded token payload.
    return res.status(200).json({
        success: true,
        message: 'Welcome to the secure dashboard, ' + req.user.username + '!',
        data: {
            user     : req.user.username,
            loginTime: new Date().toLocaleString(),
            info     : 'This data is protected and only visible after authentication.'
        }
    });
});

// ── Step 6: Start the server ───────────────────────────────────
app.listen(PORT, () => {
    console.log('');
    console.log('  ✅  Server is running at http://localhost:' + PORT);
    console.log('  📌  POST /api/login      → Login endpoint');
    console.log('  🔒  GET  /api/dashboard  → Protected endpoint');
    console.log('');
});
