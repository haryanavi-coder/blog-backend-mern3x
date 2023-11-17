const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, {
    dbName: process.env.DB_NAME
}).then(
    () => {
        console.log('Connected to database');
    }
).catch((err) => {
    console.log("Failed to connect to database!! " + err);
});


