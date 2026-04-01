const joi = require('joi');

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


// Export the registerValidation function so it can be used in other parts of the application, such as in routes or controllers
module.exports.registerValidation = registerValidation; 


// Export the loginValidation function so it can be used in other parts of the application, such as in routes or controllers
module.exports.loginValidation = loginValidation; 