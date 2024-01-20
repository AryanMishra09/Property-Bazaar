import express from 'express';
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import listingRouter from "./routes/listingRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((error)=>{
    console.log("Error connecting to MongoDB: ", error);
});

const app = express();

app.use(express.json());

app.use(cookieParser());


                                //Routes:

//test and user Route-
app.use("/api/user", userRouter);

//auth route - 
app.use("/api/auth", authRouter);

//Listing route
app.use("/api/listing", listingRouter);



const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server is running in Port ${PORT}`);
});


//middleware for handling the error:
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).send({
        success:false,
        statusCode,
        message,
    })
})