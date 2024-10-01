const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
// Assume we have some middleware for authentication.
const { ensureAuthenticated } = require('../middleware/auth');

// Route to get all blogs
router.get('/', blogController.blog_index);

// Route to render the "create new blog" form
router.get('/create', blogController.blog_create_get);

// Route to create a blog
router.post('/', blogController.blog_create_post);

// Route to get details of a specific blog by ID
router.get('/:id', blogController.blog_details);

// Route to delete a specific blog by ID
router.delete('/:id', blogController.blog_delete);

// Route to like a blog post (middleware ensures the user is authenticated)
router.post('/:id/like', ensureAuthenticated, blogController.likePost);

// Route to unlike a blog post (middleware ensures the user is authenticated)
router.post('/:id/unlike', ensureAuthenticated, blogController.unlikePost);

module.exports = router;