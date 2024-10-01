const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,  // Minimum length for title
      maxlength: 200, // Maximum length for title
      index: true,    // Index for faster search
    },
    snippet: {
      type: String,
      required: true,
      maxlength: 300, // Maximum length for snippet
    },
    body: {
      type: String,
      required: true,
      minlength: 10, // Minimum length for body
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
      },
    ],
  },
  { 
    timestamps: true // Automatically manage createdAt and updatedAt fields 
  }
);

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;