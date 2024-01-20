import express from "express";
import { deleteUser, getUser, getUserListing, test, updateUser } from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// for testing purpose
router.get("/test", test)

// for updating the user profile
router.post("/update/:id", verifyToken, updateUser);

// for deleting the user 
router.delete("/delete/:id", verifyToken, deleteUser);

// for getting all the listings of the user based on userid: 
router.get("/listings/:id", verifyToken, getUserListing);

// for finding the user based on the given id:  
router.get("/:id", verifyToken, getUser);

export default router;