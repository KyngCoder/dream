const { default: mongoose } = require('mongoose');
const postMessage = require('../models/postMessages');


const getPosts = async(req,res)=>{
    const {page} = req.query
    try{
        const LIMIT = 8
        const startIndex = (Number(page) -1) * LIMIT
        const total = await postMessage.countDocuments({})
        
        const posts = await postMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex)

        console.log(posts)


        res.status(200).json({data:posts,currentPage:Number(page),numberOfPages:Math.ceil(total/LIMIT)})
    }catch(error){
        res.status(404).json({message:error.message})
    }
}

const getPost = async (req,res) => {
    const {id} = req.params;
    try{
        const post = await postMessage.find(id)
        res.status(200).json(post)
    }catch(error){
        res.status(404).json({message:error.message})
    }
}

const getPostsBySearch = async (req,res) => {
    const {searchQuery,tags} = req.query
    try{
        const title = new RegExp(searchQuery, 'i')
        const posts = await postMessage.find({ $or: [{title},{tags:{$in:tags.split(',')}}]})
        res.json({data:posts})
    }catch(error){
        res.status(404).json({message:error.message})
    }
}


const createPost = async(req,res) => {
  const post = req.body

  const newPost = new postMessage({...post,creator:req.userId,createdAt:new Date().toISOString()})

  try{
      await newPost.save()

      res.status(201).json(newPost)
  }catch(error){
      res.status(409).json({message:error.message})
  }
}

const updatePost = async(req,res) => {
    const {id:_id} = req.params
    console.log(_id)
    const post = req.body
    console.log(post)
    
    if(mongoose.Types.ObjectId.isValid(_id)) {
        const updatePost = await postMessage.findByIdAndUpdate(_id,post,{new:true})
        console.log(updatePost)

        res.json(updatePost)
    }else{
        return res.status(404).send('Post not found')
    }

   
}


const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await postMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

const likePost = async (req, res) => {
    const { id } = req.params;

    if(!res.userId) return res.json({message:'Unauthenticated'})


    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    
    const post = await postMessage.findById(id);

    const index = post.likes.findIndex(id => id === String(req.userId))

    if(index === -1){
        post.likes.push(req.userId)
    }else{
        post.likes = post.likes.filter(id => id !== String(req.userId))
    }

    const updatedPost = await postMessage.findByIdAndUpdate(id,post, { new: true });
    
    res.json(updatedPost);
}


module.exports = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPostsBySearch
}