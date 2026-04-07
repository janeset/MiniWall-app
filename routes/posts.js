const express = require('express');
const router = express.Router();


// Import the methods function from the proper service file to handle the logic for each endpoint
const postService = require('../services/postService'); 
const commentService = require('../services/commentService');
const likeService = require('../services/likeService');
const postSearchService = require('../services/postSearchService');
const validation = require('../utilities/validation');


// Define the routes for the posts endpoints and associate them with the corresponding methods from the proper service file

// Use the getAllPosts function to handle GET requests to the /api/posts/getAll endpoint
router.get('/getAll', validation.tokenValidation, postService.getAllPosts);

// Use the createPost function to handle POST requests to the /api/posts/new endpoint
router.post('/new', validation.tokenValidation, postService.createPost); 

// Use the getPostById function to handle GET requests to the /api/posts/:postId endpoint
router.get('/:postId', validation.tokenValidation, postService.getPostById); 

// Use the updatePostById function to handle PATCH requests to the /api/posts/:postId endpoint
router.patch('/:postId', validation.tokenValidation, postService.updatePostById); 

// Use the deletePostById function to handle DELETE requests to the /api/posts/:postId endpoint
router.delete('/:postId', validation.tokenValidation,    postService.deletePostById); 

// Use the getPostwithCommentsById function to handle GET requests to the /api/posts/:postId/comments endpoint
router.get('/:postId/comments', validation.tokenValidation, postService.getPostwithCommentsById); 

// create a new comment for a specific post using the createComment function to handle POST requests to the '/api/posts/:postId/comments/new' endpoint
router.post('/:postId/comments/new', validation.tokenValidation, commentService.createComment); 

// Use the likePost function to handle POST requests to the /api/likes/:postId/like endpoint
router.post('/:postId/like', validation.tokenValidation, likeService.likePost);

// Use the unlikePost function to handle POST requests to the /api/likes/:postId/unlike endpoint
router.post('/:postId/unlike', validation.tokenValidation, likeService.unlikePost);

// Use the getAllLikesByPostId function to handle GET requests to the /api/posts/:postId/likes endpoint
router.get('/:postId/likes', validation.tokenValidation, likeService.getAllLikesByPostId);

// Use searchPostByDate function to handle GET requests to the '/api/posts/search/dates' endpoint
router.get('/search/dates', validation.tokenValidation, postSearchService.searchPostsByDateRange);

// Use searchPostByUsername function to handle GET requests to the '/api/posts/search/:username' endpoint
router.get('/search/:username', validation.tokenValidation, postSearchService.searchPostsByUsername);

// Use searchPostByTitle function to handle GET requests to the '/api/posts/search/title/:keywords' endpoint
router.get('/search/title/:keywords', validation.tokenValidation, postSearchService.searchPostsByTitle);


// export the router to be used in app.js
module.exports = router;