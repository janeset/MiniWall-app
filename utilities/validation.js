const joi = require('joi');
const jsonwebtoken = require('jsonwebtoken');
// Import configuration settings
const config = require('../config/config'); 




/*
    Name    : registerValidation
    Purpose :  - User validation for the username,password and email fields using Joi library.
                if the validation is successful, the userinput is valid otherwise, an error message is returned.
*/
const registerValidation = (data) => {
    // Define a Joi schema for validating user registration data, which includes username, email, and password fields
    const schemaValidaton = joi.object({        
        username: joi.string()                    
                     .required()
                     .min(3)
                     .max(256),        
        password: joi.string()
                     .required()
                     .min(6)
                     .max(1024),         
        email: joi.string()
                  .required()
                  .min(3)
                  .max(256)
                  .email(),
    })
    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}



/*
    Name    : loginValidation
    Purpose :  - User validation for the password and email fields using Joi library.
                if the validation is successful, the user is authenticated and granted access to the application,
                otherwise, an error message is returned.
*/
const loginValidation = (data) => {
    const schemaValidaton = joi.object({
        password: joi.string()
                     .required()
                     .min(6)
                     .max(1024),     
        email: joi.string()
                  .required()
                  .min(3)
                  .max(256)
                  .email(),
    })
    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}




/*
    Name    : tokenValidation
    Purpose :  - Validates the authentication token in the request header, 
                when a user tries to access protected routes that require authentication,
                 if the token is valid, the user has access to the protected route, otherwise, access is denied.
    returns  : - 200 OK status if the token is valid
               - 401 Unauthorized status if the token is invalid or missing
*/
const tokenValidation = (req, res, next) => {

    try {
        // get the token from the 'auth-token' header
        const token = req.header('auth-token');
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




/*
    Name    : userUpdateValidation
    Purpose :  - User validation for the username and password fields using Joi library.
                if the validation is successful, the userinput is valid otherwise, an error message is returned.
*/
const userUpdateValidation = (data) => {

    const schemaValidaton = joi.object({
        password: joi.string().required().min(6).max(1024),     
        email: joi.string().required().min(3).max(256).email(),
    })

    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}
 


/*
    Name    : createPostValidation
    Purpose :  Input validation for creating a post using the Joi library.
                if the validation is successful, the post input is valid otherwise, an error message is returned.
*/
const createPostValidation = (data) => {

    const schemaValidaton = joi.object({
        userId: joi.string().required(),
        username: joi.string().required().min(3).max(256),
        title: joi.string().required().min(3).max(256),
        text: joi.string().required().min(10).max(1024),
        hashtag: joi.string().required().min(3).max(256),
        location: joi.string().required().min(3).max(256),
        url: joi.string().required().min(3).max(1024),
        likes: joi.number().required().integer().min(0).max(1000000),
        comments: joi.number().required().integer().min(0).max(1000000)        
    })

    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}



/*
    Name    : updatePostValidation
    Purpose :  Input validation for updating a post using the Joi library.
                if the validation is successful, the post input is valid otherwise, an error message is returned.
*/
const updatePostValidation = (data) => {

    const schemaValidaton = joi.object({
        title: joi.string().required().min(3).max(256),
        text: joi.string().required().min(10).max(1024),
        hashtag: joi.string().required().min(3).max(256),
        location: joi.string().required().min(3).max(256),
        url: joi.string().required().uri().min(3).max(1024),
        likes: joi.number().required().integer().min(0).max(1000000),
        comments: joi.number().required().integer().min(0).max(1000000)       
    })

    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}



/*
    Name    : postIdValidation
    Purpose :  Input validation for ID of document from MongoDB, must be 24 alphanumeric characters.
               if the validation is successful, the input is valid otherwise, an error message is returned.
*/
const postIdValidation = (data) => {

    const schemaValidaton = joi.object({
        postId: joi.string().required().min(24).max(24).alphanum()      
    })
    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}



/*
    Name    : userIdValidation
    Purpose :  Input validation for ID of document from MongoDB, must be 24 alphanumeric characters.
               if the validation is successful, the input is valid otherwise, an error message is returned.
*/
const userIdValidation = (data) => {

    const schemaValidaton = joi.object({
        userId: joi.string().required().min(24).max(24).alphanum()      
    })
    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}



/*
    Name    : commentIdValidation
    Purpose :  Input validation for ID of document from MongoDB, must be 24 alphanumeric characters.
               if the validation is successful, the input is valid otherwise, an error message is returned.
*/
const commentIdValidation = (data) => {

    const schemaValidaton = joi.object({
        commentId: joi.string().required().min(24).max(24).alphanum()      
    })
    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}



/*
    Name    : likeIdValidation
    Purpose :  Input validation for ID of document from MongoDB, must be 24 alphanumeric characters.
               if the validation is successful, the input is valid otherwise, an error message is returned.
*/
const likeIdValidation = (data) => {

    const schemaValidaton = joi.object({
        likeId: joi.string().required().min(24).max(24).alphanum()      
    })
    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}





/*
    Name    : commentValidation
    Purpose : Input validation for creating a comment using the Joi library.
              if the validation is successful, the comment input is valid otherwise, an error message is returned.
*/
const commentValidation = (data) => {

    const schemaValidaton = joi.object({
        text: joi.string().required().min(10).max(1024),
        username: joi.string().min(3).max(256)      
    })

    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}



/*
    Name    : LikeValidation
    Purpose : Input validation for creating a like using the Joi library.
              if the validation is successful, the like input is valid otherwise, an error message is returned.
*/
const likeValidation = (data) => {

    const schemaValidaton = joi.object({
        username: joi.string().required().min(3).max(256),
        email: joi.string().required().min(3).max(256).email()      
    })

    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}



/*
    Name    : dateSearchValidation
    Purpose : Input validation for searching by date using the Joi library.
              if the validation is successful, the date input is valid otherwise, an error message is returned.
*/
const dateSearchValidation = (data) => {

    const schemaValidaton = joi.object({
        startDate: joi.date().required(),
        endDate: joi.date().required().greater(joi.ref('startDate'))     
    })

    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}

/*
    Name    : inputSearchValidation
    Purpose : Input validation for searching by date using the Joi library.
              if the validation is successful, the date input is valid otherwise, an error message is returned.
*/
const usernameSearchValidation = (data) => {

    const schemaValidaton = joi.object({
        username: joi.string().required().min(3).max(256)   
    })

    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}


/*
    Name    : inputSearchValidation
    Purpose : Input validation for searching by date using the Joi library.
              if the validation is successful, the date input is valid otherwise, an error message is returned.
*/
const titleSearchValidation = (data) => {

    const schemaValidaton = joi.object({
        keywords: joi.string().required().min(3).max(256)   
    })

    // Use the defined schema to validate the input data and return the result of the validation
    return schemaValidaton.validate(data);
}




// Export all methods so that it can be used in other parts of the application.
module.exports = {
    registerValidation, 
    loginValidation,
    tokenValidation,
    userUpdateValidation,
    createPostValidation,
    updatePostValidation,
    commentValidation,
    likeValidation,
    dateSearchValidation,
    usernameSearchValidation,
    titleSearchValidation,
    postIdValidation,
    userIdValidation,
    commentIdValidation,
    likeIdValidation
};

