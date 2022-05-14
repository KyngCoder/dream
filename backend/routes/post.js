const express = require('express')
//import controllers
const {getPostsBySearch,getPosts,getPost,createPost,updatePost,deletePost,likePost} = require('../controllers/posts')

const auth = require('../middleware/auth')

const router = express.Router()

router.get('/',getPosts)
router.get('/search',getPostsBySearch)
router.get('/:id',getPost)

router.post('/',auth,createPost)

router.patch('/:id',auth,updatePost)

router.delete('/:id',auth, deletePost)

router.patch('/:id/likePost',auth, likePost)


module.exports = router