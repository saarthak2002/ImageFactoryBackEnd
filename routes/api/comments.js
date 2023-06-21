const express = require('express');
const router = express.Router();

const Comment = require('../../models/Comment.js');
const UserDetails = require('../../models/UserDetails.js');

router.get('/:post_id', (request, result) => {
    const postId = request.params.post_id;
    Comment
        .find({ postId: postId })
        .then(comments => {
            UserDetails
                .find({ user: { $in: comments.map(comment => comment.userId) } })
                .then(userDetails => {
                    if(userDetails.length > 0) {
                        const updatedComments = comments.map(comment => {
                            const userDetailsObj = userDetails.find(userDetails => userDetails.user.equals(comment.userId));
                            if(userDetailsObj) {
                                return { ...comment._doc, profilePicture: userDetailsObj.profilePicture };
                            }
                            return comment;
                        })
                        result.json(updatedComments);
                    }
                    else {
                        result.json(comments);
                    }
                })
                .catch(err => result.status(404).json({ nousersfound: 'No users found' }));
        })
        .catch(err => result.status(404).json({ nousersfound: 'No comments found', error: err }));
});

router.post('/', (request, result) => {
    Comment
        .create(request.body)
        .then(comment => {
            result.json({ msg: 'Comment added successfully', error: false });
        })
        .catch(err => result.status(400).json({ error: 'Unable to add this comment', text: err, error: true }));
});

module.exports = router;