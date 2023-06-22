const express = require('express');
const router = express.Router();

const UserDetails = require('../../models/UserDetails.js');

router.get('/', (request, result) => {
    UserDetails
        .find()
        .then(userDetails => result.json(userDetails))
        .catch(err => result.status(404).json({ nopostsfound: 'No details found', txt: err }));
});

// get user details by user id

router.get('/user/:user_id', (request, result) => {
    UserDetails
        .findOne({ user: request.params.user_id })
        .then(userDetails => result.json(userDetails))
        .catch(err => result.status(404).json({ nodetailsfound: 'No details found', txt: err }));
});

// add a follower
router.post('/follow', (request, result) => {
    const currentUser = request.body.currentUser;
    const userToFollow = request.body.userToFollow;
    
    UserDetails
        .findOne({user: currentUser})
        .then( (userdetails) => {
            if(userdetails.following.includes(userToFollow)) {
                result.json({ msg: 'Already following this user', error:true })
            }
            else {
                userdetails.following.push(userToFollow); // add profile user to following list of user who made request
                userdetails.save();
                UserDetails
                    .findOne({user: userToFollow})
                    .then( (userdetails) => {
                        userdetails.followers.push(currentUser); // add user who made request to followers list of profile user
                        userdetails.save();
                        result.json({ msg: 'User followed successfully', error:false })
                    })
                    .catch(err => result.status(400).json({ error: 'Unable to follow this user', text: err ,error:true}));
            }
        })
        .catch(err => result.status(400).json({ error: 'Unable to follow this user', text: err ,error:true}));
});

// remove a follower
router.post('/unfollow', (request,result) => {
    const currentUser = request.body.currentUser;
    const userToUnfollow = request.body.userToUnfollow;

    UserDetails
        .findOne({user: currentUser})
        .then( (userDetails) => {
            if(!userDetails.following.includes(userToUnfollow)) {
                result.json({ msg: 'Does not follow this user', error:true })
            }
            else {
                const index = userDetails.following.indexOf(userToUnfollow);
                if (index > -1) {
                    userDetails.following.splice(index, 1);
                    userDetails.save();
                }
                UserDetails.findOne({user: userToUnfollow})
                            .then( (userDetails) => {
                                const index = userDetails.followers.indexOf(currentUser);
                                if (index > -1) {
                                    userDetails.followers.splice(index, 1);
                                    userDetails.save();
                                    result.json({ msg: 'User unfollowed successfully', error:false })
                                }
                            })
                            .catch(err => result.status(400).json({ error: 'Unable to unfollow this user', text: err ,error:true}));
            }
        })
        .catch(err => result.status(400).json({ error: 'Unable to unfollow this user', text: err ,error:true}));
});

// change profile picture
router.post('/profilepicture', (request, result) => {
    const user = request.body.user;
    const profilePicture = request.body.profilePicture;
    console.log(user);
    console.log(profilePicture);

    UserDetails
        .findOne({user: user})
        .then( (userDetails) => {
            userDetails.profilePicture = profilePicture;
            userDetails.save();
            result.json({ msg: 'Profile picture changed successfully', error:false })
        })
        .catch(err => result.status(400).json({ error: 'Unable to change profile picture', text: err ,error:true}));

});

// edit bio
router.post('/bio/:id', (request, result) => {
    const bio = request.body.bio;
    const userDetailsId = request.params.id;
    console.log(userDetailsId +  ' change bio to ' + bio);
    UserDetails
        .findById(userDetailsId)
        .then( (userDetails) => {
            userDetails.bio = bio;
            userDetails.save();
            result.json({ msg: 'Bio changed successfully', error:false })
        })
        .catch(err => result.status(400).json({ error: 'Unable to change bio', text: err ,error:true}));
});

module.exports = router;