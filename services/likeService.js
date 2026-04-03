const Post = require('../models/Post');
const Like = require('../models/Like');


/*
    Name    : likePost
    Purpose :  - Use 'POST request' with the '/api/likes/:postId/like' endpoint, to create a new like in the database, 
                 and update the like count in the post. send the updated Post back to the client in JSON format.
    returns  : - 200 OK status with the created like in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the creation process
*/
const likePost = async(req, res) => {
    try{
        const getPostById = await Post.findById(req.params.postId);
        if (!getPostById) {
            return res.status(404).send({message:`Post not found: ${req.params.postId}`});
        } 
        
        //TO-DO: get user by email from request body and validate user is not 'Liking' their own post
        //  before creating a like document in the database
        const getUserById = await User.findById(getPostById.userId);
        if (!getUserById) {
            return res.status(404).send({message:`User not found: ${getPostById.userId}`});

        } else {            
            
            // validate user is not 'Liking' their own post before creating a like document in the database
            if (getUserById._id.toString() === getPostById.userId) {
                return res.status(400).send({message:'You cannot like your own post'});
            }

            getPostById.likes += 1; //increment the likes count by 1
            const updatedPost = await getPostById.save(); //save the updated post back to the database

            //create a new like document in the database with the postId and user information
            const likeData = new Like({
                postId: updatedPost._id,
                user: req.body.user,
                email: req.body.email
            });

            await likeData.save(); //save the like data to the database
            return res.send(`Like Page, I liked : ${req.params.postId}`); //send the updated post back to the client
        }

    } catch(error) {
        res.send({message:error});
    }  
}
 


/*
    Name    : unlikePost
    Purpose :  - Use 'POST request' with the '/api/likes/:postId/unlike' endpoint, to create a new like in the database, 
                 and update the like count in the post. send the updated Post back to the client in JSON format.
    returns  : - 200 OK status with the created like in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the creation process
*/
const unlikePost = async(req, res) => {
    try{
        const getPostById = await Post.findById(req.params.postId);
        if (!getPostById) {
            return res.status(404).send({message:`Post not found: ${req.params.postId}`});
        } else {            
            
            //TO-DO: get user by email from request body and validate user is not 'Liking' their own post
            //  before creating a like document in the database
            const getUserById = await User.findById(getPostById.userId);
            if (!getUserById) {
                return res.status(404).send({message:`User not found: ${getPostById.userId}`});

            }
            // validate user is not 'Liking' their own post before creating a like document in the database
            if (getUserById && getUserById._id.toString() === getPostById.userId) {
                return res.status(400).send({message:'You cannot unlike your own post'});
            }

            getPostById.likes -= 1; //decrement the likes count by 1
            const updatedPost = await getPostById.save(); //save the updated post back to the database

            const deletedLike = await Like.deleteOne( // delete the like from the database using the deleteOne method
                                {_id:updatedPost._id} //find the like by its ID
                            );
            res.send(deletedLike); //send the delete result back to the client

            //create a new like document in the database with the postId and user information
            const likeData = new Like({
                postId: updatedPost._id,
                user: updatedPost.user,
                email: getUserById.email
            });

            await likeData.save(); //save the like data to the database
            return res.send(`Like Page, I liked : ${req.params.postId}`); //send the updated post back to the client
        }

    } catch(error) {
        res.send({message:error});
    }  
}


/*
    Name    : getAllLikesByPostId
    Purpose :  - Use 'GET request' with the '/api/posts/:postId/likes' endpoint, to retrieve all likes for a specific post from the database, and send the retrieved likes back to the client in JSON format.
    returns  : - 200 OK status with the retrieved likes in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the retrieval process
*/
const getAllLikesByPostId = async(req, res) => {
    try {
        const likes = await Like.find({ postId: req.params.postId }); // Retrieve all likes for a specific post
        res.status(200).json(likes); // Send the retrieved likes back to the client with a 200 OK status
    } catch (error) {
        console.error('Error retrieving likes:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : getLikeById
    Purpose :  - Use 'GET request' with the '/api/likes/:likeId' endpoint, to retrieve a like by its ID from the database, and send the retrieved like back to the client in JSON format.
    returns  : - 200 OK status with the retrieved like in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the retrieval process
*/
const getLikeById = async(req, res) => {
    try {
        const getLikeById = await Like.findById(req.params.likeId);
        res.send(getLikeById);
    } catch (error) {
        console.error('Error getting like by ID:', error);
        res.status(400).send({message:error});
    }
}


// Export all methods so that it can be used in other parts of the application.
module.exports = {
    likePost,
    unlikePost,
    getAllLikesByPostId,
    getLikeById
}
