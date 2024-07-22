import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoute from './routes/user.route.js';

const app=express();


dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());
const PORT=process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI,).then
(()=>console.log('Mongodb Connected..')).catch(err=>
    console.log(err));

    app.use("/user",userRoute);
app.get('/',(req,res)=>{
    res.send("Hello Wrold change kr diya fir se");
});

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
})