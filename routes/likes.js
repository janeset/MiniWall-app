const express = require('express');
const router = express.Router();
const likeService = require('../services/likeService');
const validation = require('../utilities/validation');  


// Define the routes for the posts endpoints and associate them with the corresponding methods from the like Service.js file

// find all likes, using a GET request to the '/api/likes/getAll' endpoint
router.get('/getAll', validation.tokenValidation, likeService.getAllLikes); 

// find a like by its ID, using a GET request to the '/api/likes/:likeId' endpoint
router.get('/:likeId', validation.tokenValidation, likeService.getLikeById); 


// export the router to be used in app.js
module.exports = router;