import express from "express";
import { google, signOut, signin, signup } from "../controllers/authController.js";

const router=express.Router();

//for signup
router.post("/signup", signup);

//for signin || login
router.post("/signin", signin);

//for signin via google || login
router.post("/google", google);

//for signout:
router.get("/signout", signOut);

export default router;