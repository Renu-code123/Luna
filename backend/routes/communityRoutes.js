const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/Community');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// @route   GET /api/community/posts
// @desc    Get all community posts with pagination
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    
    const posts = await CommunityPost.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('user', 'name')
      .populate('comments.user', 'name');
    
    const total = await CommunityPost.countDocuments(query);
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/community/posts/:id
// @desc    Get a single post by ID
// @access  Public
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id)
      .populate('user', 'name')
      .populate('comments.user', 'name');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/community/posts
// @desc    Create a new post
// @access  Private
router.post('/posts', verifyToken, async (req, res) => {
  try {
    const { title, content, category, tags, isAnonymous } = req.body;
    
    const post = await CommunityPost.create({
      user: req.userId,
      title,
      content,
      category,
      tags: tags || [],
      isAnonymous: isAnonymous || false
    });
    
    const populatedPost = await CommunityPost.findById(post._id)
      .populate('user', 'name');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/community/posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/posts/:id/comments', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.comments.push({
      user: req.userId,
      content,
      createdAt: new Date()
    });
    
    await post.save();
    
    const updatedPost = await CommunityPost.findById(req.params.id)
      .populate('user', 'name')
      .populate('comments.user', 'name');
    
    res.status(201).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/community/posts/:id/like
// @desc    Like or unlike a post
// @access  Private
router.put('/posts/:id/like', verifyToken, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if post is already liked by user
    const alreadyLiked = post.likes.includes(req.userId);
    
    if (alreadyLiked) {
      // Unlike the post
      post.likes = post.likes.filter(id => id.toString() !== req.userId);
    } else {
      // Like the post
      post.likes.push(req.userId);
    }
    
    await post.save();
    
    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/community/user/posts
// @desc    Get all posts by the logged in user
// @access  Private
router.get('/user/posts', verifyToken, async (req, res) => {
  try {
    const posts = await CommunityPost.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name');
    
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/community/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/posts/:id', verifyToken, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is the post owner
    if (post.user.toString() !== req.userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await post.remove();
    
    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;