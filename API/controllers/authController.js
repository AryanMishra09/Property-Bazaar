import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import { errorHandler } from './../utils/error.js';
import jwt from 'jsonwebtoken';


// FOR SIGNUP OF NEW USER: 

export const signup = async (req , res, next) => {
    const {username, email, password}= req.body;

    //hashing password and saving new user:
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({username, email, password: hashedPassword}); 

    try {
        await newUser.save();

        return res.status(201).send({
            message : "User created Succesfully"
        });       
    } catch (error) {
        next(error);
    };
};


//FOR LOGIN A EXISTING USER: 

export const signin = async( req, res, next) => {
   
    const {email, password} = req.body;

    try {

        //for finding if user exists or not:
        const validUser = await User.findOne({email : email}) 
        if(!validUser){
            return next(errorHandler(404, "User not found!"));
        }

        //for validating the password: 
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(401, "Wrong Credentials!"));
        }

        //for setting up token with cookie
        const {password: pass, ...rest} =  validUser._doc;                       //for removing password from the response
        const token = jwt.sign({id : validUser._id}, process.env.JWT_SECRET);
        res.cookie('access_token', token, {httpOnly: true})
        .status(200)
        .json(rest);

        //for setting up token without cookie
        // const token = jwt.sign({id : validUser._id}, process.env.JWT_SECRET, {expiresIn: '1d'});
        // return res.status(200).send({
        //     success: "true",            
        //     validUser
        // });

    } catch (error) {
        next(error);
    }

} ;


//FOR LOGIN A EXISTING USER via GOOGLE:

export const google = async (req, res, next) => {
    try {

        //for finding if user exists or not:
        const user = await User.findOne({email : req.body.email}) 
        if(user){

            //for setting up token with cookie
            const {password: pass, ...rest} =  user._doc;                       //for removing password from the response
            const token = jwt.sign({id : user._id}, process.env.JWT_SECRET);
            res.cookie('access_token', token, {httpOnly: true})
            .status(200)
            .json(rest);
 
        }else{

            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) , 
                email: req.body.email, 
                password: hashedPassword,
                avatar: req.body.photo
            });

            await newUser.save();

            //for setting up token with cookie
            const {password: pass, ...rest} =  user._doc;                       //for removing password from the response
            const token = jwt.sign({id : user._id}, process.env.JWT_SECRET);
            res.cookie('access_token', token, {httpOnly: true})
            .status(200)
            .json(rest);

        }

    } catch (error) {
        next(error);
    }
};


//FOR SIGNING OUT A EXISTING USER:

export const signOut= (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).send({
            message: "User has been logged out",
        });
        
    } catch (error) {
        next(error);
    }
}