import { errorHandler } from "../utils/error.js";
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Listing from "../models/listingModel.js";

//For testing
export const test = (req,res) => {
    return res.send({
        message: "Test API Route is working",
    });
}

//For updating User
export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only update your own Account! "));
    }
    try {
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar : req.body.avatar
            }
            // set is going to check wheather the data is being changed otherwise it will simply ignore it
        }, {new: true});

        const {password, ...rest} = updateUser._doc;

        res.status(200).send(rest);
    } catch (error) {
        next(error);
    }
} 


//For deleting User:
export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id){
        return next(errorHandler(401, "You can only delete your own account"));
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).send({
            message: "User has been Deleted",
        })
    } catch (error) {
        next(error);
    }
}


//For getting user listings:

export const getUserListing = async (req, res, next) => {
    
    if(req.user.id === req.params.id){
        try {
            const listings = await Listing.find({userRef: req.params.id})
            res.status(200).send({
                listings,
            })
        } catch (error) {
            next(error);
        }
    }else{
        next(errorHandler(401, 'You can only view your own listings!'));
    }
    
}

// for finding the user based on the given id:
export const getUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user){
            return next(errorHandler(401, "User not Found"));
        }

        const { password, ...rest } = user._doc;

        res.status(200).json(rest);
        
    } catch (error) {
        next(error);
    }
}