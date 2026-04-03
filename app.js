const express = require('express');
const app = express();

// Import configuration settings
const config = require('./config/config'); 

// Import database connection functions
const db = require('./config/db');  

const bodyParser = require('body-parser');
// Use body-parser middleware to parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(bodyParser.json());


// IMPORT VARIABLES
const PORT = config.PORT;

// define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Home page!');
});

// Connect to the database
db.connectDB();

// Check the database connection status
db.dbConnectionStatus();


// Import the films route from the routes/films.js file
const filmsRoute = require('./routes/films');
const authUserRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const likeRoute = require('./routes/likes');
const commentRoute = require('./routes/comments');
const userRoute = require('./routes/users');

// Use the films route for any requests to the /films endpoint
app.use('/api/films', filmsRoute);
app.use('/api/user', authUserRoute);
app.use('/api/posts', postRoute); 
app.use('/api/likes', likeRoute); // Use the like route for any requests to the /posts endpoint (for liking a post)
app.use('/api/comments', commentRoute); // Use the comment route for any requests to the /posts endpoint (for commenting on a post)
app.use('/api/users', userRoute); // Use the user route for any requests to the /users endpoint (for user registration and login)

// Start server in port 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

