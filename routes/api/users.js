const express = require('express');
const router = express.Router();

const User = require('../../models/User.js');
const UserDetails = require('../../models/UserDetails.js');

router.get('/', (request, result) => {
    User.find()
        .then(users => result.json(users))
        .catch(err => result.status(404).json({ nousersfound: 'No users found' }));
});

router.post('/auth', (request, result) => {
    User.findOne({ username: request.body.username })
        .then(user => {
            if(user) {
                if (user.password === request.body.password) {
                    result.json({ login:true, msg: 'User authenticated successfully', username: user.username, _id: user._id, email: user.email, error:false })
                } else {
                    result.json({ login:false, msg: 'Incorrect password', error:true })
                }
            }
            else {
                result.json({ login:false, msg: 'Username does not exist', error:true })
            }
        })
        .catch(err => result.status(404).json({ nouserfound: 'No user found', error:true, msg:'Username does not exist. Please sign up.' }));
});

router.post('/signup', (request, result) => {
    User.findOne({ username: request.body.username })
        .then(user => {
            if (user) {
                result.json({ msg: 'Username already exists', error:true })
            }
            else {
                User.create(request.body)
                    .then( (user) => {
                        UserDetails.create({user: user._id, followers: [], following: []})
                                   .then(userDetails => result.json({ msg: 'User added successfully', username: user.username, _id: user._id, email: user.email, error:false }))
                                   .catch(err => result.status(400).json({ error: 'Unable to add this user', text: err ,error:true}));
                    })
                    .catch(err => result.status(400).json({ error: 'Unable to add this user', text: err ,error:true}));
            }
        })
        .catch(err => result.status(404).json({ nouserfound: 'Error signing up' ,error:true }));
});

// search for users by username
router.get('/search/:searchString', (request, result) => {
    const regex = new RegExp(request.params.searchString, 'i');
    User.find({ username: { $regex: regex } }) // {$text: {$search: request.params.searchString}}
        .then(users => result.json(users))
        .catch(err => result.status(404).json({ nousersfound: 'No users found' }));
});

module.exports = router;