import { Schema, Document, Types } from 'mongoose';

// Define reaction interface
export interface IReaction extends Document {
    reactionId: Types.ObjectId;
    reactionBody: string;
    username: string;
    createdAt: Date | string;
}

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

// Define the reaction schema
const reactionSchema = new Schema<IReaction>(
    {
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
            get: (value: Date) => formatDate(value),
        },
    },
    {
        toJSON: {
            getters: true,
            virtuals: true,
        },
        id: false,
    }
);

reactionSchema
    .virtual('reactionId')
    .get(function (this: IReaction) {
        return this._id;
    });

// Export the reactionSchema
export default reactionSchema;