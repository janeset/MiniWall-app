const express = require('express');
const router = express.Router();
const commentService = require('../services/commentService');

// Define the routes for the posts endpoints and associate them with the corresponding methods from the postService.js file

// Use the getAllComments function to handle GET requests to the '/api/comments/getAll' endpoint
router.get('/getAll', commentService.getAllComments); 

// user gets all comments for a specific post using the getAllCommentsByPostId function to handle GET requests to the '/api/comments/:postId/comments' endpoint
router.get('/:postId/comments', commentService.getAllCommentsByPostId);

// Use the getCommentById function to handle GET requests to the '/api/comments/:commentId' endpoint
router.get('/:commentId', commentService.getCommentById); 

// Use the updatePostById function to handle PATCH requests to the '/api/comments/:commentId' endpoint
router.patch('/:commentId', commentService.updateCommentById); 

// Use the deletePostById function to handle DELETE requests to the '/api/comments/:commentId' endpoint
router.delete('/:commentId', commentService.deleteCommentById); 



// export the router to be used in app.js
module.exports = router;