const Post = require('../models/Post');
const validation = require('../utilities/validation');

/*
    Name    : searchPostsByTitle
    Purpose :  - Use 'GET request' with the '/api/posts/search/title/:keywords' endpoint, 
                to search for posts with a title containing the specified keywords, and send the retrieved posts back to the client in JSON format.
    returns  : - 200 OK status with the retrieved posts in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the search process
*/
const searchPostsByTitle = async (req, res) => {
    try {
        // input validation
        const {error} = validation.inputSearchValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        }
        
        const keywords = req.params.keywords;
        // Validate that the keywords parameter is not empty
        if (!keywords) {
            return res.status(400).json({ message: "Keywords can not be empty." });
        }

        // Perform a case-insensitive search for posts with a title that contains the keyword (case-insensitive) and sort by date in descending order (newest first)
        const postsByTitleKeyword = await Post
                                            .find({ title: { 
                                                $regex: keywords,  // Use a regular expression to search for the keyword in the title
                                                $options: 'i' } }) // $options: 'i' makes the search case-insensitive
                                            .sort({ date: -1 }); 

        // validate if any posts were found for the title keyword and
        if (postsByTitleKeyword.length === 0) {
            return res.status(404).json({ message: `No posts found with title containing keyword: ${keywords}` });
        } else {        
            res.json(postsByTitleKeyword);
        }
       
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        } 
        console.error('Error Searching posts by title keyword:', error);        
        res.status(400).send({message:error});
    }
};




/*
    Name    : searchPostsByUsername
    Purpose :  - Use 'GET request' with the '/api/posts/search/:username' endpoint, 
                to search for posts by a specific username, and send the retrieved posts back to the client in JSON format.
    returns  : - 200 OK status with the retrieved posts in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the search process
 */
const searchPostsByUsername = async (req, res) => {
    try {
        // input validation
        const {error} = validation.inputSearchValidation(req.params)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        } 

        // Validate that the username parameter is not empty
        const username = req.params.username;
        if (!username) {
            return res.status(400).json({ message: "Username can not be empty." });
        }

        // Perform a case-insensitive search for posts with a username that matches the query (case-insensitive) and sort by date in descending order (newest first)
        const postsByUser = await Post.find({ username: username.trim() })
                                .collation({ locale: 'en', // Use English locale for case-insensitive search
                                            strength: 2 , // Strength 2 makes the search case-insensitive (ignores case but not diacritics)
                                            alternate: 'shifted', // Ignores spaces/punctuation
                                            maxVariable: 'space'})  // Specifically treats spaces as ignorable
                                .sort({ date: -1 });  
        
        // validate if any posts were found for username and 
        if (postsByUser.length === 0) {
            return res.status(404).json({ message: `No posts found for username: ${username}` });
        } else {
             res.json(postsByUser);
        }                        
       
    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        } 
        console.error('Error Searching posts by username:', error);        
        res.status(400).send({message:error});
    }
};




/*
    Name    : searchPostsByDateRange
    Purpose :  - Use 'GET request' with the '/api/posts/search/dates' endpoint, 
                to search for posts within a specified date range, and send the retrieved posts back to the client in JSON format.
    returns  : - 200 OK status with the retrieved posts in JSON format if the operation is successful
               - 400 Bad Request status with an error message if there is an error during the search process
*/
const searchPostsByDateRange = async (req, res) => {
    try {
        // input validation
        const {error} = validation.dateSearchValidation(req.body)
        if (error){
            //send a response with status code 400 (Bad Request) and error details
            return res.status(400).send({validationError: error['details'][0]['message']});  
        }

        // Convert the startDate and endDate query parameters to Date objects        
        const startDate = req.body.startDate ? new Date(req.body.startDate) : null;
        const endDate = req.body.endDate ? new Date(req.body.endDate) : null;

        //Validate empty input and "Invalid Date" format (Invalid Date is a Date object with NaN time value, which is what new Date() returns when it receives an invalid date string)
        if ((!startDate || isNaN(startDate.getTime())) || (!endDate || isNaN(endDate.getTime()))) {
            return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
        }

        // Validate that startDate is not after endDate
        if (startDate > endDate) {
            return res.status(400).json({ message: "Start date cannot be after End date." });
        }

        // build mongoDB query to search for posts within the specified date range
        const dbQuery = {
            date: {
                $gte: startDate.setHours(0, 0, 0, 0),
                $lte: endDate.setHours(23, 59, 59, 999)
            }
        };

        // Execute the query and sort by date in descending order (newest first)
        const posts = await Post.find(dbQuery).sort({ date: -1 }); 
        res.json(posts);

    } catch (error) {
        if (error.name === 'CastError' || error.name === 'ValidationError' || error.name === 'TypeError') {
            return res.status(400).json({ message: `${error.name}: ${error.message}.  Invalid ${error.path}: ${error.value}` });
        } 
        console.error('Error Searching posts by date:', error);        
        res.status(400).send({message:error});
    }
};





module.exports = {
    searchPostsByDateRange,
    searchPostsByUsername,
    searchPostsByTitle
}