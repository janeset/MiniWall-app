
const Post = require('../models/Post');


/*
    Name    : getAllPosts
    Purpose :  - Use 'GET request' with the '/api/posts/getAll' endpoint, to retrieve all posts from the database, and send the retrieved posts back to the client in JSON format.
    returns  : - 200 OK status with the retrieved posts in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the retrieval process
*/
const getAllPosts = async(req, res) => {
    try {
        const posts = await Post.find(); // Retrieve all posts from the database
        res.status(200).json(posts); // Send the retrieved posts back to the client with a 200 OK status
    } catch (error) {
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
        const postData = new Post({
                user:req.body.user,
                title:req.body.title,
                text:req.body.text,
                hashtag:req.body.hashtag,
                location:req.body.location,
                url:req.body.url
        })

        const postToSave = await postData.save();
        res.send(postToSave);

    } catch (error) {
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
        const getPostById = await Post.findById(req.params.postId);
        res.send(getPostById);
    } catch (error) {
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
        const updatedPostById = await Post.updateOne(
                    {_id:req.params.postId,}, //find the post by its ID
                    // update the post's fields with the new data from the request body using the $set operator
                    {$set: {
                        user: req.body.user,
                        title: req.body.title,
                        text: req.body.text,
                        hashtag: req.body.hashtag,
                        location: req.body.location,
                        url: req.body.url
                    }}
                );
                res.send(updatedPostById); //send the update result back to the client
    } catch (error) {
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
        const deletedPostById = await Post.deleteOne( // delete the post from the database using the deleteOne method 
                    {_id:req.params.postId} //find the post by its ID
                );
                res.send(deletedPostById); //send the delete result back to the client
    } catch (error) {
            console.error('Error deleting post by ID:', error);
        res.status(400).send({message:error});
    }
}


// Export all methods so that it can be used in other parts of the application.
module.exports = {
    getAllPosts,
    createPost,
    getPostById,
    updatePostById,
    deletePostById
}


