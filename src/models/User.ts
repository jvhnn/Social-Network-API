import { Schema, model, Document, Types } from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';

// Define user interface
interface IUser extends Document {
    username: string;
    email: string;
    thoughts?: Types.ObjectId[];
    friends?: Types.ObjectId[];
}

// Define user schema
const userSchema = new Schema<IUser>(
    {
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
                validator: (str: string) => isEmail(str),
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
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

// Create virtual property friendCount
userSchema
    .virtual('friendCount')
    .get(function (this: IUser) {
        return this.friends?.length;
    });

// Initialize user model
const User = model<IUser>('user', userSchema);
export default User;