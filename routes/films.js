// Import the Express library to create a router for handling film-related routes
const express = require('express');

// Create a new router object to handle routes related to films
const router = express.Router();

// Import the Film model, which will be used to interact with the films collection in MongoDB
const Film = require('../models/Film');
// Import the verifyToken middleware, which will be used to protect certain routes and ensure that only authenticated users can access them
const verifyToken = require('../Utilities/verifyToken');

// File path: routes/films.js
router.get('/', verifyToken, async (req, res) => {
    //res.send('This is the films page');
    try {
        const films = await Film.find().limit(5) // Retrieve the top 5 films from the database
        res.send(films); // Send the retrieved films as a response to the client

    } catch(error) {
        // send status code 400 (Bad Request) and the error message if there is an error during the retrieval process
        res.status(400).send({message:error}) 
    }
    //connect to database

    // retrieve top 5 films
});

// Define a route to retrieve a specific film by its ID
router.get('/:filmId', verifyToken, async(req, res) => {
    try {
        const film = await Film.findById(req.params.filmId) // Retrieve a specific film by its ID from the database
        res.send(film); // Send the retrieved film as a response to the client
    } catch(error) {
        res.send({message:error})
    }
})

// Export the films router so it can be used in other parts of the application, such as app.js
module.exports = router;