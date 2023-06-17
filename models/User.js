const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    {   
        timestamps: true 
    }
);

UserSchema.index( {username: 'text'} );

module.exports = User = mongoose.model('appuser', UserSchema);