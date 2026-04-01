const express = require('express');
const router = express.Router();

// Import the User model, which will be used to interact with the users collection in MongoDB
const User = require('../Models/User');
// Import the bcryptjs library, which will be used for hashing passwords and comparing hashed passwords during login
const bcryptjs = require('bcryptjs');
// Import the jsonwebtoken library, which will be used for generating and verifying JSON Web Tokens (JWT) for user authentication
const jsonwebtoken = require('jsonwebtoken');
// import the validation function for user registration and login from the validations/validation.js file
const {registerValidation, loginValidation} = require('../Utilities/validation')

// Define a route for user registration
router.post('/register', async (req, res) => {

    //parse error message
    /*
    {
        "value": {
            "username": "Mary",
            "email": "myemail@gmail.com",
            "password": "12345"
        },
        "error": {
            "_original": {
                "username": "Mary",
                "email": "myemail@gmail.com",
                "password": "12345"
            },
            "details": [
                {
                    "message": "\"password\" length must be at least 6 characters long",
                    "path": [
                        "password"
                    ],
                    "type": "string.min",
                    "context": {
                        "limit": 6,
                        "value": "12345",
                        "label": "password",
                        "key": "password"
                    }
                }
            ]
        }
    }   
    */
    // input validation
    const {error} = registerValidation(req.body)
    if (error){
        //send a response with status code 400 (Bad Request) and a JSON object containing the validation error message extracted from the error details
       return res.status(400).send({validationError: error['details'][0]['message']});  
    } 

    // Second validation: Check if user already exists in db (using email as key)
    const userExists = await User.findOne({email: req.body.email});
    if(userExists) {
        return res.status(400).send({message: "User already exists."});
    }

    // Register new user
    try {
        // Password encryption
        const salt = await bcryptjs.genSalt(5);
        const hashedPassword = await bcryptjs.hash(req.body.password, salt); 
        // Create a new user instance using the data from the request body, including the hashed password
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        // Save the new user to the database and send the saved user as a response to the client
        const savedUser = await user.save();
        res.send(savedUser);

    } catch (error) {
        res.status(400).send({savingErrorMsg: error})
    }
           

   
    
})


// USER LOGIN



// Define a route for user login
router.post('/login', async (req, res) => {
    // input validation
    const {error} = loginValidation(req.body)
    if (error){
        //send a response with status code 400 (Bad Request) and a JSON object containing the validation error message extracted from the error details
       return res.status(400).send({validationError: error['details'][0]['message']});  
    } 

    // Second validation: Check if user already exists in db (using email as key)
    const userExists = await User.findOne({email: req.body.email});
    if(!userExists) {
        return res.status(400).send({message: "User does not exist."});
    }

    // Password validation: Compare the provided password with the hashed password stored in the database using bcryptjs's compare function
    const isPasswordValid = await bcryptjs.compare(req.body.password, userExists.password);
    if (!isPasswordValid) {
        return res.status(400).send({message: "Invalid password."});
    }

    // If login is successful, generate a JSON Web Token (JWT) for the authenticated user using jsonwebtoken's sign function, which takes the user's ID and a secret key as parameters
    const token = jsonwebtoken.sign(
        { _id: userExists._id },
        process.env.TOKEN_SECRET,
        //{ expiresIn: '1h' } // Set the token to expire in 1 hour
    );
    res.header('auth-token', token).send({message: "Login successful.", token: token, user: {username: userExists.username, email: userExists.email}});

})


// Export the authentication router so it can be used in other parts of the application, such as app.js
module.exports = router;