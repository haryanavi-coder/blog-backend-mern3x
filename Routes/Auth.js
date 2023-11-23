const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema')
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// transporter will send emails to everyone
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS
    } 
});

router.get('/test', async (req, res) => {
    res.json({message : "Auth API is working"})
})

function createResponse(ok, message, data) {
    return {
      ok,
      message,
      data,
    };
  }

// router.post('/register', async (req, res) => {
//     try{
//         const {name, email, password} = req.body;
//         const existingUser = await User.findOne({email: email});
//         if(existingUser){
//             return res.status(409).json({message: "User already exists"})
//         }
//         else{
//             const newUser = new User({
//                 name: name,
//                 email: email,
//                 password: password
//             })
//             newUser.save();
//             res.status(201).json({message: "User registered successfully"});
//         }
//     }
//     catch(err){
//         res.status(500).json({message: err.message});
//     }
// })

router.post('/register', async (req, res, next) => { // next is middleware // if any error then next will take lead
    try{
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email: email});

        if(existingUser){
            return res.status(409).json(createResponse(false, 'Email already exists'));
        }
        
        const newUser = new User({
            name,
            email,
            password
        })
        await newUser.save();
        res.status(201).json(createResponse(true, 'User registered successfully'));
        
    }
    catch(err){
        next(err);
    }
});

router.post('/sendotp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
        const mailOptions = {
            from: process.env.COMPANY_EMAIL,
            to: email,
            subject: 'OTP for verification of blog3x',
            text: `Your OTP for verification is ${otp}`,
        };

        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                console.log(err);
                res.status(500).json(createResponse(false, err.message));
            } else {
                res.json(createResponse(true, 'OTP sent successfully', { otp }));
            }
        });
    } 
    catch (err) {
        console.log(err);
        res.status(500).json(createResponse(false, err.message));
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json(createResponse(false, 'Invalid credentials'));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json(createResponse(false, 'Invalid credentials'));
        }

        // Generate an authentication token with a 10-minute expiration
        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });

        // Generate a refresh token with a 10-day expiration
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '1d' });
        res.cookie('authToken', authToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        res.status(200).json(createResponse(true, 'Login successful', {
            authToken,
            refreshToken
        }));
    } catch (err) {
        next(err);
    }
});

// tthis will be at the last
// error at last // errorHandler reference is for a function defined
//  in errorMiddleware file in Middleware
router.use(errorHandler);


router.get('/checklogin', authTokenHandler, async (req, res) => {
    res.json({
        ok: true,
        message: 'User authenticated successfully'
    })
})


module.exports = router;