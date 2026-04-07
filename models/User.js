const mongoose = require('mongoose');

// Define user schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 256
    },
    email: {
        type: String,
        required: true,
        min: 3,
        max: 256
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// Export the User model so it can be used in other parts of the application, using the name 'users' for the collection in MongoDB
module.exports = mongoose.model('users', userSchema);