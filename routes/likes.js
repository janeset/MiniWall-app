const express = require('express');

const router = express.Router();

// import the Like model to interact with the likes collection in MongoDB
const Like = require('../models/Like');
// import the Post model to interact with the posts collection in MongoDB
const Post = require('../models/Post');

router.get('/:postId/like2', async (req, res) => {
    //res.send(`Like Page, I liked : ${req.params.postId}`);
    try{
        const getPostById = await Post.findById(req.params.postId);
        if (!getPostById) {
            return res.status(404).send({message:`Post not found: ${req.params.postId}`});
        } else {
            getPostById.likes += 1; //increment the likes count by 1
            const updatedPost = await getPostById.save(); //save the updated post back to the database

            const likeData = new Like({
                postId: updatedPost._id,
                user: updatedPost.user
            });

            await likeData.save(); //save the like data to the database
            return res.send(`Like Page, I liked : ${req.params.postId}`); //send the updated post back to the client
        }

    } catch(error) {
        res.send({message:error});
    }   

    
});


// POST (route for creating a like in the database)
router.post('/:id/like', async(req, res) => {
    // find the post by id and increment the likes count by 1
     try {
            console.log(req.params.id); //log the post id to the console for debugging purposes
            const getPostById = await Post.findById(req.params.postId);
            res.send(getPostById); //send the retrieved post back to the client
            if(!getPostById) {
                return res.status(404).send({message:'Post not found'});
            } else {
                getPostById.likes += 1; //increment the likes count by 1
                await getPostById.save(); //save the updated post back to the database
                return res.send(getPostById); //send the updated post back to the client
            }
        } catch(error) {
            res.send({message:error});
        }
})


// export the router to be used in app.js
module.exports = router;