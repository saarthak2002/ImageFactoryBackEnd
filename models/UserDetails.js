const mongoose = require('mongoose');

const UserDetailsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    followers: { 
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    },
});

module.exports = UserDetails = mongoose.model('userdetails', UserDetailsSchema);