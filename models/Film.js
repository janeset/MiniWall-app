const mongoose = require('mongoose');

// Define a schema for the Film model, which represents the structure of film documents in the MongoDB collection
const FilmSchema = new mongoose.Schema({
    film_name:{
        type: String
    },
    film_type:{
        type: String
    },
    film_year:{
        type: String
    },
    film_director:{
        type: String
    }
});


// Create a Mongoose model named 'Film' using the defined schema, which will be used to interact with the 'films' collection in MongoDB
const Film = mongoose.model('Film', FilmSchema);

// Export the Film model so it can be used in other parts of the application, such as in routes or controllers
module.exports = Film;