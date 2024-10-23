import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js';
import { Types } from 'mongoose';

// GET all users api/users
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const allUsers = await User.find(); // Retrieve all users
        if (!allUsers.length) {
            res.status(404).json({ message: 'No users found' });
            return;
        }
        res.status(200).json(allUsers);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// GET user by id api/users/:userId
export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId) // Find user by ID and populate
            .populate('thoughts')
            .populate('friends');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// POST user api/users
export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body); // Create new user with req.body data
        res.status(201).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// PUT user api/users/:userId
export const updateUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        // Find user by ID and update with req.body data
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
            new: true,
            runValidators: true,
        })
            .populate('thoughts')
            .populate('friends');

        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json(updatedUser);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// DELETE user api/user/:userId
export const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Remove associated thoughts before deleting user
        await Thought.deleteMany({ username: user.username });
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// POST friend to user api/users/:userId/friends/:friendId
export const createFriend = async (req: Request, res: Response) => {
    const { userId, friendId } = req.params;
    try {
        // Checks for valid user and friend ID
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(friendId)) {
            res.status(400).json({ message: 'Invalid user or friend ID' });
            return;
        }

        const user = await User.findById(userId); // Find by user ID
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const friendObjectId = new Types.ObjectId(friendId);

        // Checks if friend is in user friend list
        if (user.friends?.includes(friendObjectId)) {
            res.status(400).json({ message: 'This user is already a friend' });
            return;
        }

        // Adds friendObjectId to friends ObjectId array
        user.friends?.push(friendObjectId);
        
        await user.save();
        res.status(201).json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// DELETE friend from user api/users/:userId/friends/:friendId
export const deleteFriend = async (req: Request, res: Response) => {
    const { userId, friendId } = req.params;
    try {
        // Checks for valid user and friend ID
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(friendId)) {
            res.status(400).json({ message: 'Invalid user or friend ID' });
            return;
        }

        const user = await User.findById(userId); // Find by user ID
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const friendObjectId = new Types.ObjectId(friendId);

        // Cannot find friend in friends list
        if (!user.friends?.includes(friendObjectId)) {
            res.status(400).json({ message: 'Friend not found' });
            return;
        }

        // Filters list of friends to not include friendObjectId
        user.friends = user.friends.filter(friend => !friend.equals(friendObjectId));

        await user.save();
        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}