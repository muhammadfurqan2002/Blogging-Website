import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import postRouter from './routes/post.route.js';
const app=express()

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("db connected successfully");
}).catch((error)=>{
    console.log(error)
})

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/post',postRouter)




app.use((err,req,res,next)=>{
        const statusCode=err.statusCode || 500;
        const message=err.message || 'Internal Server Error';
        res.status(statusCode).json({
            success:false,
            statusCode,
            message
        })
})








app.listen(3000,()=>{
    console.log("Server is running on port 3000!")
})
