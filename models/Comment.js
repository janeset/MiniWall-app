const mongoose = require('mongoose');

// Define the comment schema
const CommentSchema = mongoose.Schema({
    postId:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
    
});

// Export the comment model, ('comments' is the name of the collection in the database and CommentSchema is the schema we just defined)
module.exports = mongoose.model('comments', CommentSchema);