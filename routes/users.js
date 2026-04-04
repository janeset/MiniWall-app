const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const validation = require('../utilities/validation');


// Define the routes for the posts endpoints and associate them with the corresponding methods from the userService.js file

// (Create) Register an user, using a POST request to the '/api/users/register' endpoint
router.post('/register', userService.createUser); 

// (Login) Authenticate an user, using a POST request to the '/api/users/login' endpoint
router.post('/login', validation.loginValidation, userService.loginUser);

// Update an user by their ID, using a PUT request to the '/api/users/:userId' endpoint
router.put('/:userId', validation.tokenValidation, userService.updateUserById); 

// Delete an user by their ID, using a DELETE request to the '/api/users/:userId' endpoint
router.delete('/:userId', validation.tokenValidation, userService.deleteUserById);  

// get a list of all registered users, using a GET request to the '/api/users/getAll' endpoint
router.get('/getAll', validation.tokenValidation, userService.getAllRegisteredUsers); 

// find a user by their ID, using a GET request to the '/api/users/:userId' endpoint
router.get('/:userId', validation.tokenValidation, userService.getUserById); 


// export the router to be used in app.js
module.exports = router;