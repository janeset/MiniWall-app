const express = require('express');

const router = express.Router();

// import the Post model to interact with the posts collection in MongoDB
const Post = require('../models/Post');

const postService = require('../services/postService'); // Import the getAllPosts function from the postService.js file
router.get('/getAll', postService.getAllPosts); // Use the getAllPosts function to handle GET requests to the /api/posts/getAll endpoint


// route for post page, which will be accessed at http://localhost:3000/posts
// router.get('/', (req, res) => {
//     res.send('Post Page');
// });

// POST (route for creating a post in the database)
router.post('/new', async (req, res) => {
    //res.send('Post Created');
    //console.log(req.body);

    const postData = new Post({
        user:req.body.user,
        title:req.body.title,
        text:req.body.text,
        hashtag:req.body.hashtag,
        location:req.body.location,
        url:req.body.url
    })

    //try to save the post data to the database and send a response back to the client
    try {
        const postToSave = await postData.save();
        res.send(postToSave);
    } catch(error) {
        res.send({message:error});
    }
})


// GET (route for getting all the posts from the database)
router.get('/', async (req, res) => {
    try {
        const getAllPosts = await Post.find(); //.limit(10); //retrieve all posts from the database, you can limit the number of posts returned by using .limit() method
        res.send(getAllPosts); //send the retrieved posts back to the client
    } catch(error) {
        res.send({message:error});
    }

})

// GET By ID (route for getting all the posts from the database)
router.get('/:postId', async (req, res) => {
    try {
        const getPostById = await Post.findById(req.params.postId);
        res.send(getPostById); //send the retrieved post back to the client
    } catch(error) {
        res.send({message:error});
    }
})


// PATCH (route for updating a post in the database)
router.patch('/:postId', async (req, res) => {
    try {
        const updatePostById = await Post.updateOne(
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
        res.send(updatePostById); //send the update result back to the client

    } catch (error) {
        res.send({message:error});
    }
});


// DELETE (route for deleting a post from the database)
router.delete('/:postId', async (req, res) => {
    try {
        const deletedPostById = await Post.deleteOne(
            {_id:req.params.postId}
        );
        res.send(deletedPostById); //send the delete result back to the client
    } catch(error) {
        res.send({message:error});
    }
});

// export the router to be used in app.js
module.exports = router;