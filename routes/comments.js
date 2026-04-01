const express = require('express');

const router = express.Router();

// import the Comment model to interact with the comments collection in MongoDB
const Comment = require('../models/Comment');
// import the Post model to interact with the posts collection in MongoDB
const Post = require('../models/Post');

router.get('/:postId/comment', async (req, res) => {
    //res.send(`Like Page, I liked : ${req.params.postId}`);
    try{
        const getPostById = await Post.findById(req.params.postId);
        if (!getPostById) {
            return res.status(404).send({message:`Post not found: ${req.params.postId}`});
        } else {

            const commentData = new Comment({
                postId: getPostById._id,
                text: req.body.text,
                user: req.body.user
            });

            await commentData.save(); //save the comment data to the database

            getPostById.comments += 1; //increment the likes count by 1
            await getPostById.save(); //save the updated post back to the database
            
            return res.send(`Comment Page, I commented on : ${req.params.postId}`); //send the updated post back to the client
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