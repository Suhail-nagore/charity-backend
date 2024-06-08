import dotenv from "dotenv"

dotenv.config({
    path:"./.env"
})


import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import userRoutes from "./routes/user.route.js"


const app = express();

// middlewares

app.use(cors());
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({extended:true, limit:'50mb'}));

// Routes
app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/donations',);

app.use((err, req, res, next)=>{
    console.error(err);
    res.status(500).json({message:"Server Error"});

});

// connection to mongodb database

mongoose.connect(process.env.MONGO_URI , {
    useNewUrlParser:true,
}).then(()=>{
    console.log("Mongo DB connected")
}).catch((err)=>{
    console.error(err);
    process.exit(1);
});

const PORT = process.env.PORT || 6000;

app.listen(PORT, ()=>{
    console.log(`Server is Running on port ${PORT}`);
});


