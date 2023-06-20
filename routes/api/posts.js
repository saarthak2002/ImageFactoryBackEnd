const express = require('express');
const router = express.Router();

const Post = require('../../models/Post.js');
const UserDetails = require('../../models/UserDetails.js');

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

// add a post
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

// get feed for logged in user
router.get('/feed/:user_id', (request, result) => {
    UserDetails
        .findOne({ user: request.params.user_id })
        .then(userDetails => {
            if(userDetails.following.length > 0) {
                Post.find({ postedByUser: { $in: userDetails.following } })
                    .sort({ createdAt: -1 })
                    .then(posts => result.json(posts))
                    .catch(err => result.status(404).json({ nopostsfound: 'No posts found' }));
            }
            else {
                result.json([]);
            }
        })
        .catch(err => result.status(404).json({ nouserdetailsfound: 'No user details found' }));
})

router.post('/like/:id', (request, result) => {
    const currentUser = request.body.currentUser;
    Post
        .findById(request.params.id)
        .then((post) => {
            if(post.likedBy.includes(currentUser)) {
                result.json({ msg: 'Post already liked', success:false });
            }
            else {
                post.likedBy.push(currentUser);
                post.save();
                result.json({ success:true, msg: 'Post liked successfully', userId: currentUser, postID: post._id});
            }
        })
        .catch(err => result.status(404).json({ nopostfound: 'No post found', error: err }));
});

router.post('/unlike/:id', (request, result) => {
    const currentUser = request.body.currentUser;
    Post
        .findById(request.params.id)
        .then((post) => {
            if(post.likedBy.includes(currentUser)) {
                // remove the user from the likedBy array
                const index = post.likedBy.indexOf(currentUser);
                if (index > -1) {
                    post.likedBy.splice(index, 1);
                    post.save();
                    result.json({ success:true, msg: 'Post unliked successfully', userId: currentUser, postID: post._id});
                }
            }
            else {
                result.json({ msg: 'Post not already liked', success:false });
            }
        })
        .catch(err => result.status(404).json({ nopostfound: 'No post found', error: err }));
});

module.exports = router;