const express = require('express');
const router = express.Router();
const commentService = require('../services/commentService');
const validation = require('../utilities/validation');

// Define the routes for the comments endpoints and associate them with the corresponding methods from the commentService.js file

// Use the getAllComments function to handle GET requests to the '/api/comments/getAll' endpoint
router.get('/getAll', validation.tokenValidation, commentService.getAllComments); 

// user gets all comments for a specific post using the getAllCommentsByPostId function to handle GET requests to the '/api/comments/:postId/comments' endpoint
router.get('/:postId/comments', validation.tokenValidation, commentService.getAllCommentsByPostId);

// Use the getCommentById function to handle GET requests to the '/api/comments/:commentId' endpoint
router.get('/:commentId', validation.tokenValidation, commentService.getCommentById); 

// Use the updatePostById function to handle PATCH requests to the '/api/comments/:commentId' endpoint
router.patch('/:commentId', validation.tokenValidation, commentService.updateCommentById); 

// Use the deletePostById function to handle DELETE requests to the '/api/comments/:commentId' endpoint
router.delete('/:commentId', validation.tokenValidation, commentService.deleteCommentById); 



// export the router to be used in app.js
module.exports = router;