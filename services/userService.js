const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const validation = require('../utilities/validation');



/*
    Name    : createUser
    Purpose :  - Use 'POST request' with the '/api/comments/:postId/new' endpoint, to create a new comment in the database, and send the created comment back to the client in JSON format.
    returns  : - 200 OK status with the created comment in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the creation process
*/
const createUser = async(req, res) => {
    try {

        // input validation
        const {error} = validation.registerValidation(req.body)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 

        // Check if user already exists in db (using email as key)
        const userExists = await User.findOne({email: req.body.email});
        if(userExists) {
            return res.status(400).send({message: "User already exists."});
        }
        // Password encryption
        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(req.body.password, salt); 
        // Create a new user instance using the data from the request body, including the hashed password
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        // Save the new user to the database and send the saved user as a response to the client
        const savedUser = await user.save();
        return res.send(savedUser);
        
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }  
        console.error('Error Registering User:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : loginUser
    Purpose :  - Use 'POST request' with the '/api/users/login' endpoint, to authenticate a user and generate a JWT token, and send the token back to the client in JSON format.
    returns  : - 200 OK status with the generated JWT token in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the login process
*/
const loginUser = async(req, res) => {
    try {

        // input validation
        const {error} = validation.loginValidation(req.body)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 
        
        // Check if user exists in db (using email as key)
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            return res.status(400).send({message: "User does not exist."});
        }
        // Check if password is correct
        const validPassword = await bcryptjs.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send({message: "Invalid password."});
        }
        // Create and assign a token
        const token = jsonwebtoken.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token)
            .send({message: "Login successful.", "username": user.username, "token": token, user: {username: user.username, email: user.email}});
                

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }  
        console.error('Error logging in user:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : updateUserById
    Purpose :  - Use 'PATCH request' with the '/api/users/:userId' endpoint, to update a user by their ID in the database, and send the updated user back to the client in JSON format.
    returns  : - 200 OK status with the updated user in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the update process
*/
const updateUserById = async(req, res) => {
    try {

        // input validation
        const {error} = validation.userIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 

        // validate user exists in the database 
        const getUserById = await User.findById(req.params.userId);
        if (!getUserById) {
            return res.status(404).send({message:`User not found: ${req.params.userId}`});
        } 

        // validate user is not using an email already associated with another user before updating the user document in the database
        const getUserByEmail = await User.findOne({email: req.body.email});
        if (getUserByEmail && getUserById.email !== getUserByEmail.email) {
            return res.status(400).send({message: "User with this email already exists."});
        }        

        // update the user's fields with the new data from the request body using the $set operator
        const updatedUserById = await User.updateOne(
                {_id:req.params.userId,}, //find the user by their ID
                // update the user's fields with the new data from the request body using the $set operator
                {$set: {
                    username: req.body.username,
                    email: req.body.email
                }});        
        //send the update result back to the client
        res.send(updatedUserById); 

    } catch (error) {        
       if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}. Invalid ${error.path}: ${error.value}` });
        }    
        console.error('Error updating user by ID:', error);  
        res.status(400).send({message:error});
    }
}



/*
    Name    : deleteUserById
    Purpose :  - Use 'DELETE request' with the '/api/users/:userId' endpoint, to delete a user by their ID from the database, and send the deleted user back to the client in JSON format.
    returns  : - 200 OK status with the deleted user in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the delete process
*/
const deleteUserById = async(req, res) => {
    try {
        // input validation
        const {error} = validation.userIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 

        // retrieve the user by their ID from the database
        const getUserById = await User.findById(req.params.userId);
        if (!getUserById) {
            return res.status(404).send({message:`User not found: ${req.params.userId}`});
        }  

        // delete the user from the database
        const deletedUserById = await User.deleteOne({ _id: getUserById._id });
        res.send(deletedUserById); // send the delete result back to the client

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }  
        console.error('Error deleting user by ID:', error);         
        res.status(400).send({message:error});
    }
}



/*
    Name    : getAllRegisteredUsers
    Purpose :  - Use 'GET request' with the '/api/users/getAll' endpoint, to retrieve all registered users from the database, and send the retrieved users back to the client in JSON format.
    returns  : - 200 OK status with the retrieved users in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the retrieval process
*/
const getAllRegisteredUsers = async(req, res) => {
    try {
        const users = await User.find(); // Retrieve all users from the database
        res.status(200).json(users); // Send the retrieved users back to the client with a 200 OK status

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }  
        console.error('Error retrieving registered users:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : getUserById
    Purpose :  - Use 'GET request' with the '/api/users/:userId' endpoint, to retrieve a user by their ID from the database, and send the retrieved user back to the client in JSON format.
    returns  : - 200 OK status with the retrieved user in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the retrieval process
*/
const getUserById = async(req, res) => {
    try {
        // input validation
        const {error} = validation.userIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 
        const getUserById = await User.findById(req.params.userId);
        if (!getUserById) {
            return res.status(404).send({message:`User not found. UserId: ${req.params.userId}`});
        }
        return res.send(getUserById);

    } catch (error) {        
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }   
        console.error('Error getting user by ID:', error);
        return res.status(400).send({message:error});
    }
}




// Export all methods so that it can be used in other parts of the application.
module.exports = {
    createUser,
    loginUser,
    updateUserById, 
    deleteUserById,
    getAllRegisteredUsers,
    getUserById
}
