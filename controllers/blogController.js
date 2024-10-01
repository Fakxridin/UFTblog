const Blog = require('../models/blog');
const { body, validationResult } = require('express-validator');

const blog_index = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.render('index', { blogs, title: 'All blogs' });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { title: 'Error', message: 'An error occurred while retrieving blogs.' });
    }
};

const blog_details = async (req, res) => {
  const id = req.params.id;
  try {
      const blog = await Blog.findById(id);
      if (!blog) {
          return res.status(404).render('404', { title: 'Blog not found' });
      }
      // Pass `user` and `blog` to the template
      res.render('details', { blog, title: 'Blog Details', user: req.user });
  } catch (err) {
      console.error(err);
      res.status(500).render('error', { title: 'Error', message: 'An error occurred while retrieving the blog.' });
  }
};

const blog_create_get = (req, res) => {
    res.render('create', { title: 'Create a new blog' });
};

const blog_create_post = [
    body('title').notEmpty().withMessage('Title is required'),
    body('snippet').notEmpty().withMessage('Snippet is required'),
    body('body').notEmpty().withMessage('Body is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('create', {
                title: 'Create a new blog',
                errors: errors.array(),
                blog: req.body // Preserve user input to avoid losing data
            });
        }

        const blog = new Blog(req.body);
        try {
            await blog.save();
            res.redirect('/blogs');
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { title: 'Error', message: 'An error occurred while creating the blog.' });
        }
    }
];

const blog_delete = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await Blog.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.json({ redirect: '/blogs' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while deleting the blog.' });
    }
};

// Like a blog post
const likePost = async (req, res) => {
    const blogId = req.params.id;
    const userId = req.user._id; // Ensure this is getting the current user ID

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }

        // Check if user already liked the post
        if (blog.likedBy.includes(userId)) {
            return res.status(400).json({ message: "You've already liked this post." });
        }

        blog.likes++;
        blog.likedBy.push(userId);
        await blog.save();

        res.status(200).json({ message: 'Post liked!',likes: blog.likes });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Something went wrong.' });
      }
  };
  
  // Unlike a blog post
  const unlikePost = async (req, res) => {
      const blogId = req.params.id;
      const userId = req.user._id; // Ensure this is getting the current user ID
  
      try {
          const blog = await Blog.findById(blogId);
          if (!blog) {
              return res.status(404).json({ message: 'Blog not found.' });
          }
  
          // Check if user has not liked the post
          if (!blog.likedBy.includes(userId)) {
              return res.status(400).json({ message: "You haven't liked this post yet." });
          }
  
          // Decrement the likes count and remove the user ID from likedBy array
          blog.likes--;
          blog.likedBy.pull(userId);  // Using pull to remove the user ID
          await blog.save();
  
          res.status(200).json({ message: 'Post unliked!', likes: blog.likes });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Something went wrong.' });
      }
  };
  
  module.exports = {
      blog_index,
      blog_details,
      blog_create_get,
      blog_create_post,
      blog_delete,
      likePost,
      unlikePost
  };