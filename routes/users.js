const express = require('express');
const router = express.Router();
const userService = require('../services/userService');


// Define the routes for the posts endpoints and associate them with the corresponding methods from the userService.js file

// (Create) Register an user, using a POST request to the '/api/users/register' endpoint
router.post('/register', userService.createUser); 

// Update an user by their ID, using a PUT request to the '/api/users/:userId' endpoint
router.put('/:userId', userService.updateUserById); 

// Delete an user by their ID, using a DELETE request to the '/api/users/:userId' endpoint
router.delete('/:userId', userService.deleteUserById);  

// get a list of all registered users, using a GET request to the '/api/users/getAll' endpoint
router.get('/getAll', userService.getAllRegisteredUsers); 

// find a user by their ID, using a GET request to the '/api/users/:userId' endpoint
router.get('/:userId', userService.getUserById); 


// export the router to be used in app.js
module.exports = router;