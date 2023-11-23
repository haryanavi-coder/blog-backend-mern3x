const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const PORT = 8000;
require('dotenv').config();
require('./db.js');
const User = require('./Models/UserSchema')

app.use(bodyParser.json());

// Configure CORS with credentials
const allowedOrigins = ['http://localhost:3000', 'https://blog-frontend-mern3x.vercel.app']; // Add more origins as needed
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // Allow credentials
    })
);
app.use(cookieParser()); // use it before following routes 52:58 video 4

const authRoutes = require('./Routes/Auth'); 
app.use('/auth', authRoutes)

const blogRoutes = require('./Routes/Blog');
app.use('/blog', blogRoutes)

const imageuploadRoutes = require('./Routes/imageUploadRoutes');
app.use('/image', imageuploadRoutes);


app.get('/', (req, res) => {
    res.json({message : "The API is working"});
});

app.get('/blogcategories', async (req, res) => {
    const blogCategories = [
        "Technology Trends",
        "Health and Wellness",
        "Travel Destinations",
        "Food and Cooking",
        "Personal Finance",
        "Career Development",
        "Parenting Tips",
        "Self-Improvement",
        "Home Decor and DIY",
        "Book Reviews",
        "Environmental Sustainability",
        "Fitness and Exercise",
        "Movie and TV Show Reviews",
        "Entrepreneurship",
        "Mental Health",
        "Fashion and Style",
        "Hobby and Crafts",
        "Pet Care",
        "Education and Learning",
        "Sports and Recreation",
        "Crime",
        "Entertainment",
        "History",
        "Geopolitics",
        "Geography"
    ];
    res.json(
        {
            message: 'Categories fetched successfully',
            categories: blogCategories
        }
    )
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});


