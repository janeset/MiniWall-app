// Import libraries and modules
const express = require('express');
const app = express();

// Import configuration settings
const config = require('./config/config'); 
const db = require('./config/db');  

// body-parser is a middleware  used to parse JSON data sent in the request body, required for route handlers.
const bodyParser = require('body-parser');
app.use(bodyParser.json());


// Home page route
app.get('/', (req, res) => {
    res.send('Welcome to the MiniWall App - Home page!');
});


// Docker route to test if the app is running on Docker on GCP
app.get('/docker', (req, res) => {
    res.send('Welcome to the MiniWall App! Running on Docker From GCP!');
});


// Connect to the database
db.connectDB();

// Check the database connection status
db.dbConnectionStatus();


// Import the route files for handling requests to the /posts and /users endpoints
const postRoute = require('./routes/posts');
const likeRoute = require('./routes/likes');
const commentRoute = require('./routes/comments');
const userRoute = require('./routes/users');



// Use the imported route files to handle requests to the corresponding endpoints
app.use('/api/posts', postRoute); 
app.use('/api/likes', likeRoute); 
app.use('/api/comments', commentRoute); 
app.use('/api/users', userRoute); 



// Start server in configured port (3000)
const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

