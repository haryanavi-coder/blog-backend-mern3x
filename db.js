const mongoose = require('mongoose');

require('dotenv').config();


// mongoose.connect(process.env.MONGODB_URL, {
//     dbName: process.env.DB_NAME
// })
// .then(() => {
//         console.log('Connected to database');
// })
// .catch((err) => {
//     console.log("Failed to connect to database!! " + err);
// });



const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
        console.log(`MongoDB connected`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

connectDB();




