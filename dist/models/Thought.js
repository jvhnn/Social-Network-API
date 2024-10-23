import { Schema, model } from 'mongoose';
import reactionSchema from './Reaction.js';
// Function formatting the date
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
// Define thought schema
const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (value) => formatDate(value),
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema],
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
});
// Create virtual property reactionCount
thoughtSchema
    .virtual('reactionCount')
    .get(function () {
    return this.reactions.length;
});
// Initialize thought model
const Thought = model('thought', thoughtSchema);
export default Thought;
