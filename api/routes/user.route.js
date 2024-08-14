import express from 'express'
import {test,updateUser,deleteUser,signout,getUsers} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const userRoutes=express.Router();

userRoutes.get('/test',test)
userRoutes.put('/update/:userId',verifyToken,updateUser)
userRoutes.delete('/delete/:userId',verifyToken,deleteUser)
userRoutes.post('/signout',signout)
userRoutes.get('/getusers',verifyToken,getUsers)

export default userRoutes