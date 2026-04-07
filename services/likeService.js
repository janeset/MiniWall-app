const Post = require('../models/Post');
const Like = require('../models/Like');
const User = require('../models/User');
const validation = require('../utilities/validation');



/*
    Name    : likePost
    Purpose :  - Use 'POST request' with the '/api/likes/:postId/like' endpoint, to create a new like in the database, 
                 and update the like count in the post. send the updated Post back to the client in JSON format.
    returns  : - 200 OK status with the created like in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the creation process
*/
const likePost = async(req, res) => {
    try{
        // input validation
        const {error} = validation.postIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 
        // validate post exists
        const getPostById = await Post.findById(req.params.postId);
        if (!getPostById) {
            return res.status(404).send({message:`Post not found: ${req.params.postId}`});
        } 
        // validate user exists
        const getUserByEmail = await User.findOne({ email: req.body.email });
        if (!getUserByEmail) {
            return res.status(404).send({message:`User not found: ${req.body.email}`});

        } else {                        
            // validate user is not 'Liking' their own post 
            if (getUserByEmail._id.toString() === getPostById.userId) {
                return res.status(400).send({message:'You cannot like your own post'});
            }

            // validare user has not already 'Liked' the post 
            const existingLike = await Like.findOne({ postId: req.params.postId, email: req.body.email });
            if (existingLike) {
                return res.status(400).send({message:'You have already liked this post'});
            }

            getPostById.likes += 1; //increment the likes count by 1
            const updatedPost = await getPostById.save(); //save the updated post back to the database

            //create a new like document in the database with the postId and user information
            const likeData = new Like({
                postId: updatedPost._id,
                username: req.body.username,
                email: req.body.email
            });

            await likeData.save(); //save the like data to the database
            return res.send(`Liked Post: ${req.params.postId}`); //send the updated post back to the client
        }

    } catch(error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }   
        console.error('Error liking post:', error);
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
        // input validation
        const {error} = validation.postIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 

        // validate post exists
        const getPostById = await Post.findById(req.params.postId);
        if (!getPostById) {
            return res.status(404).send({message:`Post not found: ${req.params.postId}`});

        } else { 
            // validate user exists
            const getUserByEmail = await User.findOne({ email: req.body.email });
            if (!getUserByEmail) {
                return res.status(404).send({message:`User not found: ${req.body.email}`});
            }

            // validate user is not 'Liking' their own post before creating a like document in the database
            if (getUserByEmail && getUserByEmail._id.toString() === getPostById.userId) {
                return res.status(400).send({message:'You cannot unlike your own post'});
            }

            // validare user has already 'Liked' the post before allowing them to 'Unlike' the post
            const existingLike = await Like.findOne({ postId: req.params.postId, email: req.body.email });
            if (!existingLike) {
                return res.status(400).send({message:'You have not liked this post'});
            }
            if (getPostById.likes > 0) {
                getPostById.likes -= 1; //decrement the likes count by 1
            }
            const updatedPost = await getPostById.save(); //save the updated post back to the database

            const deletedLike = await Like.deleteOne( // delete the like from the database using the deleteOne method
                                {_id:existingLike._id} //find the like by its ID
                            );
                            
            return res.send(`Unliked Post: ${req.params.postId}`); //send the updated post back to the client
        }

    } catch(error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }  
        console.error('Error unliking post:', error); 
        return res.send({message:error});
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
        // input validation
        const {error} = validation.postIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 

        const likes = await Like.find({ postId: req.params.postId }); // Retrieve all likes for a specific post
        res.status(200).json(likes); // Send the retrieved likes back to the client with a 200 OK status

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }   
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
        // input validation
        const {error} = validation.likeIdValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 

        const getLikeById = await Like.findById(req.params.likeId);
        res.send(getLikeById);

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }  
        console.error('Error getting like by ID:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : getAllLikes
    Purpose :  - Use 'GET request' with the '/api/likes/getAll' endpoint, to retrieve all likes from the database, and send the retrieved likes back to the client in JSON format.
    returns  : - 200 OK status with the retrieved likes in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the retrieval process
*/
const getAllLikes = async(req, res) => {
    try {
        const likes = await Like.find();
        res.status(200).json(likes);
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }  
        console.error('Error getting like by ID:', error);
        res.status(400).send({message:error});
    }
}



/*
    Name    : deleteAllLikes
    Purpose :  - Use 'DELETE request' with the '/api/likes/deleteAll' endpoint, to delete all likes from the database.
    returns  : - 200 OK status if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the deletion process
*/
const deleteAllLikes = async(req, res) => {
    try {
        const deletedLikes = await Like.deleteMany();
        res.status(200).json(deletedLikes);
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        }  
        console.error('Error deleting all likes:', error);
        res.status(400).send({message:error});
    }
}





// Export all methods so that it can be used in other parts of the application.
module.exports = {
    likePost,
    unlikePost,
    getAllLikesByPostId,
    getLikeById, 
    getAllLikes,
    deleteAllLikes
}
