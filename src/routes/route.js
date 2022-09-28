const express = require('express')
const router = express.Router()
const { createAuthor } = require('../controllers/authorController')
const { createBlog, getBlog, updateBlog, deleteBlog, deletedByQuery } = require('../controllers/blogController')
const { authentication } = require('../middleware/auth')
const { authorLogin } = require('../controllers/loginController')

//-----------------------author-----------------------
router.post('/authors', createAuthor)
router.post('/login', authorLogin)

//------------------------blog------------------------
router.post('/blogs', authentication, createBlog)
router.get('/blogs', authentication, getBlog)
router.put('/blogs/:blogId', authentication, updateBlog)
router.delete('/blogs/:blogId', authentication, deleteBlog)
router.delete('/blogs', authentication, deletedByQuery)

module.exports = router;
