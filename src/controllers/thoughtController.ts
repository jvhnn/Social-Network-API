import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js';
import { Types } from 'mongoose';

// GET all thoughts api/thoughts
export const getAllThoughts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const allThoughts = await Thought.find(); // Retrieve all users
        if (!allThoughts.length) {
            res.status(404).json({ message: 'No users found' });
            return;
        }
        res.status(200).json(allThoughts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Get a thought by _id api/thoughts/:thoughtId
export const getThoughtById = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
        const thought = await Thought.findById(thoughtId) // Find thought by ID
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }

        res.status(200).json(thought);
    } catch (error: any) {
        if (error instanceof Types.ObjectId) {
            res.status(400).json({ message: 'Invalid thought ID' });
            return;
        }
        res.status(500).json({ message: error.message });
    }
}

// POST thought api/thoughts
export const createThought = async (req: Request, res: Response) => {
    const { thoughtText, username, userId } = req.body;
    try {
        const user = await User.findById(userId);
        // Check if user exists
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Create new thought with thoughtText and username
        const thought = await Thought.create({
            thoughtText,
            username,
        });

        // Push thought object id to user's thought array
        user.thoughts?.push(thought._id as Types.ObjectId);
        await user.save();
        res.status(201).json(thought);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// PUT thought api/thoughts/:thoughtId
export const updateThought = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
        // Find thought by ID and update with req.body data
        const updatedThought = await Thought.findByIdAndUpdate(thoughtId, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedThought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }

        res.status(200).json(updatedThought);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// DELETE thought api/thoughts/:thoughtId
export const deleteThought = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    try {
        const thought = Thought.findById(thoughtId);

        if (!thought) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        await Thought.findByIdAndDelete(thoughtId);
        res.status(200).json({ message: 'Thought deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// POST reaction api/thoughts/:thoughtId/reactions
export const createReaction = async (req: Request, res: Response) => {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;
    try {
        const thought = await Thought.findById(thoughtId);
        //Check if thought exists
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }

        // Create new reaction object
        const reaction = {
            reactionBody,
            username,
            createdAt: new Date(),
        };

        // Add reaction to thought reaction array 
        thought.reactions.push(reaction as never);
        await thought.save();
        res.status(201).json(thought);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

// Delete reaction api/thoughts/:thoughtId/reactions/:reactionId
export const deleteReaction = async (req: Request, res: Response) => {
    const { thoughtId, reactionId } = req.params;
    try {
        const thought = await Thought.findByIdAndUpdate(
            thoughtId,
            { $pull: { reactions: { _id: reactionId } } },
            { new: true });

        //Check if thought exists
        if (!thought) {
            res.status(404).json({ message: 'Thought not found' });
            return;
        }
        res.status(200).json({ message: 'Reaction deleted successfully', thought });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}