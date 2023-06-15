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
        }
    },
    {   
        timestamps: true 
    }
);

module.exports = Post = mongoose.model('post', PostSchema);