const mongoose = require('mongoose');

// Define the post schema
const PostSchema = mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    },
    hashtag:{
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
    
});

// Export the post model, ('posts' is the name of the collection in the database and PostSchema is the schema we just defined)
module.exports = mongoose.model('posts', PostSchema);