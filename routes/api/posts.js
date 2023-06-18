const express = require('express');
const router = express.Router();

const Post = require('../../models/Post.js');

router.get('/', (request, result) => {
    Post.find()
        .then(posts => result.json(posts))
        .catch(err => result.status(404).json({ nopostsfound: 'No posts found' }));
})

// get post by id
router.get('/:id', (request, result) => {
    Post.findById(request.params.id)
        .then(post => result.json(post))
        .catch(err => result.status(404).json({ nopostfound: 'No post found' }));
})

router.post('/', (request, result) => {
    Post.create(request.body)
        .then(post => result.json({ msg: 'Post added successfully' }))
        .catch(err => result.status(400).json({ error: 'Unable to add this post' }));
})

// get posts for a user
router.get('/user/:id', (request, result) => {
    Post.find({ postedByUser: request.params.id })
        .sort({ createdAt: -1 })
        .then(posts => result.json(posts))
        .catch(err => result.status(404).json({ nopostsfound: 'No posts found' }));
});

module.exports = router;