const express = require('express');
const router = express.Router();

// import the Post model to interact with the posts collection in MongoDB
const Post = require('../models/Post');

// Import the methods function from the postService.js file to handle the logic for each endpoint
const postService = require('../services/postService'); 

// Define the routes for the posts endpoints and associate them with the corresponding methods from the postService.js file
 // Use the getAllPosts function to handle GET requests to the /api/posts/getAll endpoint
router.get('/getAll', postService.getAllPosts);

// Use the createPost function to handle POST requests to the /api/posts/new endpoint
router.post('/new', postService.createPost); 

// Use the getPostById function to handle GET requests to the /api/posts/:postId endpoint
router.get('/:postId', postService.getPostById); 

// Use the updatePostById function to handle PATCH requests to the /api/posts/:postId endpoint
router.patch('/:postId', postService.updatePostById); 

// Use the deletePostById function to handle DELETE requests to the /api/posts/:postId endpoint
router.delete('/:postId', postService.deletePostById); 


// export the router to be used in app.js
module.exports = router;