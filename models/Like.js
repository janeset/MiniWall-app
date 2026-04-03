const mongoose = require('mongoose');

// Define the post schema
const LikeSchema = mongoose.Schema({
    postId:{
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
    
});

// Export the post model, ('likes' is the name of the collection in the database and LikeSchema is the schema we just defined)
module.exports = mongoose.model('likes', LikeSchema);