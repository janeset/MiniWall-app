
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const validation = require('../utilities/validation');



/*
    Name    : getAllPosts
    Purpose :  - Use 'GET request' with the '/api/posts/getAll' endpoint, to retrieve all posts from the database, and send the retrieved posts back to the client in JSON format.
    returns  : - 200 OK status with the retrieved posts in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the retrieval process
*/
const getAllPosts = async(req, res) => {
    try {
        const posts = await Post.find().sort({ likes: -1 }); // Retrieve all posts from the database
        res.status(200).json(posts); // Send the retrieved posts back to the client with a 200 OK status
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }  
        console.error('Error retrieving posts:', error);        
        res.status(400).send({message:error});
    }
}



/*
    Name    : createPost
    Purpose :  - Use 'POST request' with the '/api/posts/new' endpoint, to create a new post in the database, and send the created post back to the client in JSON format.
    returns  : - 200 OK status with the created post in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the creation process
*/
const createPost = async(req, res) => {
    try {

        // input validation
        const {error} = validation.createPostValidation(req.body)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 
        // create a new post document in the database using the data from the request body and save it to the database, then send the created post back to the client
        const postData = new Post({
            userId: req.body.userId,
            username: req.body.username,
            title: req.body.title,
            text: req.body.text,
            hashtag: req.body.hashtag,
            location: req.body.location,
            url: req.body.url
        })
        // save the new post document to the database and send the created post back to the client
        const postToSave = await postData.save();
        res.send(postToSave);

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }  
        console.error('Error creating post:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : getPostById
    Purpose :  - Use 'GET request' with the '/api/posts/:postId' endpoint, to retrieve a post by its ID from the database, and send the retrieved post back to the client in JSON format.
    returns  : - 200 OK status with the retrieved post in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the retrieval process
*/
const getPostById = async(req, res) => {
    try {
        // input validation
        const {error} = validation.postIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 
        // retrieve the post from the database using the findById method and send it back to the client
        const getPostById = await Post.findById(req.params.postId);
        res.send(getPostById);

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }  
        console.error('Error getting post by ID:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : updatePostById
    Purpose :  - Use 'PATCH request' with the '/api/posts/:postId' endpoint, to update a post by its ID in the database, and send the updated post back to the client in JSON format.
    returns  : - 200 OK status with the updated post in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the update process
*/
const updatePostById = async(req, res) => {
    try {

        // input validation
        const {error} = validation.updatePostValidation(req.body)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 

        const updatedPostById = await Post.updateOne(
                    {_id:req.params.postId,}, //find the post by its ID
                    // update the post's fields with the new data from the request body using the $set operator
                    {$set: {
                        username: req.body.username,
                        title: req.body.title,
                        text: req.body.text,
                        hashtag: req.body.hashtag,
                        location: req.body.location,
                        url: req.body.url
                    }}
                );
                res.send(updatedPostById); //send the update result back to the client

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        } 
        console.error('Error updating post by ID:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : deletePostById
    Purpose :  - Use 'DELETE request' with the '/api/posts/:postId' endpoint, to delete a post by its ID from the database, and send the deleted post back to the client in JSON format.
    returns  : - 200 OK status with the deleted post in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the delete process
*/
const deletePostById = async(req, res) => {
    try {
        // input validation
        const {error} = validation.postIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 
        const deletedPostById = await Post.deleteOne( // delete the post from the database using the deleteOne method 
                    {_id:req.params.postId} //find the post by its ID
                );
                res.send(deletedPostById); //send the delete result back to the client

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }   
        console.error('Error deleting post by ID:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : getPostwithCommentsById
    Purpose :  - Use 'GET request' with the '/api/posts/:postId/comments' endpoint, to retrieve a post by its ID from the database.
    returns  : - 200 OK status with the retrieved post in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the retrieval process
*/
const getPostwithCommentsById = async(req, res) => {
    try {

        // input validation
        const {error} = validation.postIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 

        const getPostById = await Post.findById(req.params.postId).lean(); //  lean() gets plain JS objinstead of a Mongoose document
        if (!getPostById) {
            return res.status(404).send({message:`Post not found: ${req.params.postId}`});
        }  

        // get all comments and build a post object with the comments field populated with the actual comments, sorted by date (Newest at top).
        const comments = await Comment.find({ postId: req.params.postId }).sort({ date: -1 }).lean();        
        const postWithComments = { ...getPostById, comments };
        res.send(postWithComments); // send the post with comments back to the client

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }   
        console.error('Error getting post with comments by ID:', error);
        res.status(400).send({message:error});
    }
}




// Export all methods so that it can be used in other parts of the application.
module.exports = {
    getAllPosts,
    createPost,
    getPostById,
    updatePostById,
    deletePostById,
    getPostwithCommentsById
};


