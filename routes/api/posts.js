const express = require('express');
const router = express.Router();

const Post = require('../../models/Post.js');
const UserDetails = require('../../models/UserDetails.js');
const Comment = require('../../models/Comment.js');

const cloudinary = require('cloudinary').v2;
// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true
});

// Log the configuration
console.log(cloudinary.config());

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
router.post('/feed/:user_id', (request, result) => {
    const limit = request.body.limit;
    UserDetails
        .findOne({ user: request.params.user_id })
        .then(userDetails => {
            if(userDetails.following.length > 0) {
                Post.find({ postedByUser: { $in: userDetails.following } })
                    .sort({ createdAt: -1 })
                    .limit(limit)
                    .then(posts => {
                        UserDetails
                            .find({ user: { $in: posts.map(post => post.postedByUser) } })
                            .then(userDetails => {
                                if(userDetails.length > 0) {
                                    const updatedPosts = posts.map(post => {
                                        const userDetailsObj = userDetails.find(userDetails => userDetails.user.equals(post.postedByUser));
                                        if(userDetailsObj) {
                                            return { ...post._doc, profilePicture: userDetailsObj.profilePicture };
                                        }
                                        return post;
                                    })
                                    result.json(updatedPosts);
                                }
                                else {
                                    result.json(posts);
                                }
                            })
                            .catch(err => result.status(404).json({ nousersfound: 'No users details found', error: err }));
                    })
                    .catch(err => result.status(404).json({ nopostsfound: 'No posts found', error: err }));
            }
            else {
                result.json([]);
            }
        })
        .catch(err => result.status(404).json({ nouserdetailsfound: 'No user details found', error: err }));
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

// edit caption
router.post('/edit/:id', (request, result) => {
    const postId = request.params.id;
    const newCaption = request.body.newCaption;
    Post
        .findById(postId)
        .then((post) => {
            post.caption = newCaption;
            post.save();
            result.json({ success:true, msg: 'Post caption updated successfully', postID: post._id});
        })
        .catch(err => result.status(404).json({ nopostfound: 'No post found', error: err }));

});

// delete post
router.delete('/:id', (request, result) => {
    const postId = request.params.id;
    Post
        .findById(postId)
        .then((post) => {
            const urlParts = post.image.split('/');
            const fileName = urlParts.pop();
            fileNameParts = fileName.split('.');
            const publicId = fileNameParts[0];

            // delete image from CDN
            cloudinary.uploader
                .destroy(publicId, { invalidate: true })
                .then( (res) => {
                    // delete comments on post
                    Comment
                        .deleteMany({ postId: postId })
                        .then(() => {      
                            // delete post
                            post.deleteOne();
                            result.json({ msg: 'Post deleted successfully' });
                        })
                })
                .catch(err => {
                    console.log('error deleting image from CDN: '+ err);
                    result.status(404).json({ nopostfound: 'No post found', error: err })
                });
        })
        .catch(err => result.status(404).json({ nopostfound: 'No post found', error: err })); 
});

module.exports = router;