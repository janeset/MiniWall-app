const config = require('dotenv');
const jsonwebtroken = require('jsonwebtoken');

// Define a middleware function to verify the JSON Web Token (JWT) sent in the request headers for protected routes
function auth(req, res, next) {
    // Get the token from the request headers, specifically from the 'auth-token' header
    const token = req.header('auth-token');
    const tokenSecret = process.env.TOKEN_SECRET;
    console.log("Received token from request header:", token);
    console.log("Using TOKEN_SECRET from config:", tokenSecret);
    // If no token is provided in the request headers, send a response with status code 401 (Unauthorized) and a message indicating that access is denied
    if (!token) {
        return res.status(401).send({message: "Access denied. No token provided."});
    }

    try {
        // Verify the token using jsonwebtoken's verify function, which takes the token and the secret key as parameters
        const verified = jsonwebtroken.verify(token, tokenSecret);
        console.log("Token verification successful. Verified token payload:", verified);
        // If the token is valid, attach the verified user information to the request object (e.g., req.user) and call the next middleware function in the stack
        req.user = verified;
        next();

    } catch (error) {
        // If there is an error during token verification (e.g., invalid token), send a response with status code 401 (Unauthorized) and a message indicating that the token is invalid
        res.status(401).send({message: "Invalid token. Token verification failed. Description: " + error.message});
    }
}


// Export the auth middleware function so it can be used in other parts of the application, such as in routes that require authentication
module.exports = auth;