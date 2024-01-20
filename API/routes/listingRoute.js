import express from "express";
import { createListing, deleteListing, updateListing, getListing, getListings } from "../controllers/listingController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

//to create a new listing
router.post("/create",verifyToken ,createListing);

//to delete a listing:
router.delete("/delete/:id",verifyToken ,deleteListing);

//to edit a listing:
router.post("/update/:id",verifyToken , updateListing);

//to get a listing based on listing_id:
router.get("/get/:id", getListing);


//to get a listings through searching:
router.get("/get", getListings);


export default router;