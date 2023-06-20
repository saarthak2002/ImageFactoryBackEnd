const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        commentText: {
            type: String,
            required: true
        }
    },
    {   
        timestamps: true 
    }
);

module.exports = Comment = mongoose.model('comment', CommentSchema);