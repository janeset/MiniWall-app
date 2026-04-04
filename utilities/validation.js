const joi = require('joi');
const jsonwebtoken = require('jsonwebtoken');
// Import configuration settings
const config = require('../config/config'); 

// Define a function to validate user registration data using Joi, which is a popular validation library for JavaScript
const registerValidation = (data) => {
    // Define a Joi schema for validating user registration data, which includes username, email, and password fields
    const schemaValidaton = joi.object({
        // Validate the username field to be a required string with a minimum length of 3 and a maximum length of 256 characters
        username: joi.string()
                     .required()
                     .min(3)
                     .max(256),
        // Validate the password field to be a required string with a minimum length of 6 and a maximum length of 1024 characters
        password: joi.string()
                     .required()
                     .min(6)
                     .max(1024), 
        // Validate the email field to be a required string with a min length of 3, a max length of 256 characters, and a valid email format
        email: joi.string()
                  .required()
                  .min(3)
                  .max(256)
                  .email(),
    })
    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}


// Define a function to validate user registration data using Joi, which is a popular validation library for JavaScript
const loginValidation = (data) => {
    // Define a Joi schema for validating user registration data, which includes username, email, and password fields
    const schemaValidaton = joi.object({
        // Validate the password field to be a required string with a minimum length of 6 and a maximum length of 1024 characters
        password: joi.string()
                     .required()
                     .min(6)
                     .max(1024), 
        // Validate the email field to be a required string with a min length of 3, a max length of 256 characters, and a valid email format
        email: joi.string()
                  .required()
                  .min(3)
                  .max(256)
                  .email(),
    })
    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}


const tokenValidation = (req, res, next) => {

    try {
        // get the token from the 'auth-token' header
        const token = req.header('auth-token');
        const tokenSecret = config.TOKEN_SECRET;
        // print header nd print token and token secret for debugging purposes
        console.log('header', req.headers);
        console.log("Received token from request header:", token);

        // validate token exists in the request header
        if (!token) {
            return res.status(401).send({message: "Access denied. No token provided."});
        }
        // verify the jsonwebtoken using the token secret
        const verified = jsonwebtoken.verify(token, tokenSecret);
        if (verified) { 
            console.log("Token verification successful. Verified token payload:", verified);        
            req.user = verified;
            next();}
        else {
            res.status(401).send({message: "Invalid token. Token verification failed."});
        }

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        } 
        console.error('Error Validating jsonwebtoken:', error);
        res.status(400).send({message:error});
    }

}       
       

// Export all methods so that it can be used in other parts of the application.
module.exports = {
    registerValidation, 
    loginValidation,
    tokenValidation
};

