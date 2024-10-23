import { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
// Define user schema
const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: (str) => isEmail(str),
            message: 'Invalid email address',
        }
    },
    thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'thought',
        }],
    friends: [{
            type: Schema.Types.ObjectId,
            ref: 'user',
        }],
}, {
    toJSON: {
        virtuals: true,
    },
    id: false,
});
// Create virtual property friendCount
userSchema
    .virtual('friendCount')
    .get(function () {
    return this.friends?.length;
});
// Initialize user model
const User = model('user', userSchema);
export default User;
