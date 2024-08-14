import postModel from "../models/post.model.js"
import { errorHandler } from "../utils/error.js"

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        next(errorHandler(403, "You are not allowed to create a post"))
    }
    if (!req.body.title || !req.body.content) {
        next(errorHandler(400, "Please provide all required fields"))
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-')
    const newPost = new postModel({
        ...req.body,
        slug,
        userid: req.user.id
    })
    try {
        const savedPost = await newPost.save();
        res.status(201).json({
            success: true,
            post: savedPost
        })
    } catch (error) {
        next(error)
    }
}


export const getPost = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.order === 'asc' ? 1 : -1
        const posts = await postModel.find({
            ...(req.query.userId && { userid: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ]
            }),
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit)

        const totalPosts = await postModel.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const lastMonthPost = await postModel.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })

        res.status(200).json({ posts, totalPosts, lastMonthPost })

    } catch (error) {
        next(error)
    }
}



export const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id != req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this post'))
    }
    try {
        await postModel.findByIdAndDelete(req.params.postId)
        return res.status(200).json('The post has been deleted')
    } catch (error) {
        next(error)
    }
}



export const updatePost=async(req,res,next)=>{
    if(!req.user.isAdmin || req.user.id!==req.params.userId){
        return next(errorHandler(403,"You are not allowed to update this post"))
    }
    try{
        const updatedPost=await postModel.findByIdAndUpdate(req.params.postId,{
            $set:{
                title:req.body.title,
                content:req.body.content,
                category:req.body.category,
                image:req.body.image

            }
        },{new:true})
        res.status(200).json(updatedPost)
    }catch(error){
        next(error.message)
    }

}