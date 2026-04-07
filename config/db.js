// import modules and configuration settings
const config = require('./config'); 
const mongoose = require('mongoose');


// db connection settings
const uri = config.DB_CONNECTION;
const databaseName = config.DB_NAME;

   
//connect to mongoDB
function connectDB() {
    try {
        mongoose.connect(uri, { dbName: databaseName})        
        console.log(`You successfully connected to MongoDB! Database name: ${databaseName}`);
    } catch(err) {
        console.log({message:err})
    }
}


// Check the connection status
function dbConnectionStatus() {
    const connStates = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        4: 'invalid credentials'
    }
    const dbStatus = connStates[mongoose.connection.readyState];
    console.log(`Database connection status: ${dbStatus}`);
    
}


// export the functions for use in other parts of the application
module.exports = {
    connectDB,
    dbConnectionStatus
};