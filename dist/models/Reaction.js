import { Schema } from 'mongoose';
const formatDate = (value) => {
    const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(value);
};
// Define the reaction schema
const reactionSchema = new Schema({
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (value) => formatDate(value),
    },
}, {
    toJSON: {
        getters: true,
        virtuals: true,
    },
    id: false,
});
reactionSchema
    .virtual('reactionId')
    .get(function () {
    return this._id;
});
// Export the reactionSchema
export default reactionSchema;
