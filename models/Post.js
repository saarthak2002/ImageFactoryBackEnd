const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true
        },
        caption: {
            type: String,
            required: true
        },
        prompt: {
            type: String,
        },
        aesthetic: {
            type: String,
        },
        postedByUser: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        postedByUserName: {
            type: String,
            required: true,
        }
    },
    {   
        timestamps: true 
    }
);

module.exports = Post = mongoose.model('post', PostSchema);