const express = require('express');
const router = express.Router();

const Comment = require('../../models/Comment.js');

router.get('/:post_id', (request, result) => {
    const postId = request.params.post_id;
    Comment
        .find({ postId: postId })
        .then(comments => result.json(comments))
        .catch(err => result.status(404).json({ nousersfound: 'No comments found', error: err }));
});

router.post('/', (request, result) => {
    Comment
        .create(request.body)
        .then(comment => result.json({ msg: 'Comment added successfully', error: false }))
        .catch(err => result.status(400).json({ error: 'Unable to add this comment', text: err, error: true }));
});

module.exports = router;