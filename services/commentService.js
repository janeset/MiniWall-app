const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const validation = require('../utilities/validation');



/*
    Name    : getAllCommentsByPostId
    Purpose :  - Use 'GET request' with the '/api/comments/:postId/comments' endpoint, to retrieve all comments for a specific post from the database, and send the retrieved comments back to the client in JSON format.
    returns  : - 200 OK status with the retrieved comments in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the retrieval process
*/
const getAllCommentsByPostId = async(req, res) => {
    try {
        // input validation
        const {error} = validation.postIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 
        const comments = await Comment.find({ postId: req.params.postId }); // Retrieve all comments for a specific post
        res.status(200).json(comments); // Send the retrieved comments back to the client with a 200 OK status
    
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }   
        console.error('Error retrieving comments:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : createComment
    Purpose :  - Use 'POST request' with the '/api/comments/:postId/new' endpoint, to create a new comment in the database, and send the created comment back to the client in JSON format.
    returns  : - 200 OK status with the created comment in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the creation process
*/
const createComment = async(req, res) => {
    try {
        // input validation
        const {error} = validation.postIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 

        const getPostById = await Post.findById(req.params.postId); 
        if (!getPostById) {
            return res.status(404).send({message:`Post not found: ${req.params.postId}`});
        }
        // validte user doesnt comment on own post
        const postOwner = await User.findById(getPostById.userId);
        if (postOwner && postOwner.username === req.body.username) {
            return res.status(400).send({message:`User cannot comment on their own post. PostOwner: ${postOwner.username}, CommentOwner: ${req.body.username}`});
        
        } else { 
            getPostById.comments += 1; //increment the comments count by 1
            const updatedPost = await getPostById.save(); //save the updated post back to the database

            //create a new comment document in the database with the postId and user information
            const commentData = new Comment({
                postId: updatedPost._id,
                text: req.body.text,
                username: req.body.username
            }); 

            //save the comment data to the database
            const commentToSave = await commentData.save();
            res.send(commentToSave);     
        }
        
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }  
        console.error('Error creating comment:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : getCommentById
    Purpose :  - Use 'GET request' with the '/api/comments/:commentId' endpoint, to retrieve a comment by its ID from the database, and send the retrieved comment back to the client in JSON format.
    returns  : - 200 OK status with the retrieved comment in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the retrieval process
*/
const getCommentById = async(req, res) => {
    try {
        // input validation
        const {error} = validation.commentIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 

        const getCommentById = await Comment.findById(req.params.commentId);
        res.send(getCommentById);
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }  
        console.error('Error getting comment by ID:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : updateCommentById
    Purpose :  - Use 'PATCH request' with the '/api/comments/:commentId' endpoint, to update a comment by its ID in the database, and send the updated comment back to the client in JSON format.
    returns  : - 200 OK status with the updated comment in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the update process
*/
const updateCommentById = async(req, res) => {
    try {
        // input validation
        const {error} = validation.commentIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 

        const updatedCommentById = await Comment.updateOne(
                    {_id:req.params.commentId,}, //find the comment by its ID
                    // update the comment's fields with the new data from the request body using the $set operator
                    {$set: {
                        text: req.body.text,
                        username: req.body.username
                    }});        
                res.send(updatedCommentById); //send the update result back to the client

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }   
        console.error('Error updating comment by ID:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : deleteCommentById
    Purpose :  - Use 'DELETE request' with the '/api/comments/:commentId' endpoint, to delete a comment by its ID from the database, and send the deleted comment back to the client in JSON format.
    returns  : - 200 OK status with the deleted comment in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the delete process
*/
const deleteCommentById = async(req, res) => {
    try {
        // input validation
        const {error} = validation.commentIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 

        // retrieve the comment and post by their IDs from the database
        const getCommentById = await Comment.findById(req.params.commentId);
        if (!getCommentById) {
            return res.status(404).send({message:`Comment not found: ${req.params.commentId}`});
        }  

        const getPostById = await Post.findById(getCommentById.postId); 
        if (!getPostById) {
            return res.status(404).send({message:`Post not found: ${getCommentById.postId}`});

        } else { 
            if (getPostById.comments > 0) {
                // decrement the comments count by 1 and save the updated post back to the database
                getPostById.comments -= 1; 
            }
            const updatedPost = await getPostById.save(); 
            // delete the comment from the database 
            const deletedCommentById = await Comment.deleteOne( {_id:getCommentById._id} );            
            res.send(deletedCommentById); //send the delete result back to the client
        }

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }  
        console.error('Error deleting comment by ID:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : getAllComments
    Purpose :  - Use 'GET request' with the '/api/comments/getAll' endpoint, to retrieve all comments from the database.
    returns  : - 200 OK status with the retrieved comments in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the retrieval process
*/
const getAllComments = async(req, res) => {
    try {
        const comments = await Comment.find(); // Retrieve all comments 
        res.status(200).json(comments); // Send the retrieved comments back to the client with a 200 OK status
    
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `Get all comments error: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }   
        console.error('Error retrieving comments:', error);
        res.status(400).send({message:error});
    }
}




// Export all methods so that it can be used in other parts of the application.
module.exports = {
    getAllCommentsByPostId, 
    createComment,
    getCommentById, 
    updateCommentById,
    deleteCommentById,
    getAllComments
}
    