import { Schema, model, Document } from 'mongoose';
import reactionSchema, { IReaction } from './Reaction.js';

// Define thought interface
interface IThought extends Document {
    thoughtText: string;
    createdAt: Date | String;
    username: string;
    reactions: IReaction[];
}

// Function formatting the date
const formatDate = (value: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    return new Intl.DateTimeFormat('en-US', options).format(value);
}

// Define thought schema
const thoughtSchema = new Schema<IThought>(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (value: Date) => formatDate(value),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

// Create virtual property reactionCount
thoughtSchema
    .virtual('reactionCount')
    .get(function (this: IThought) {
        return this.reactions.length;
    });

// Initialize thought model
const Thought = model<IThought>('thought', thoughtSchema);
export default Thought;