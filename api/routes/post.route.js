import express from 'express'
import {verifyToken}  from '../utils/verifyUser.js'
import { create ,getPost,deletePost,updatePost} from '../controllers/post.controller.js';



const postRouter=express.Router()


postRouter.post('/create',verifyToken,create);
postRouter.get('/getposts',getPost)
postRouter.delete('/deletepost/:postId/:userId',verifyToken,deletePost)
postRouter.put('/updatePost/:postId/:userId',verifyToken,updatePost)



export default postRouter