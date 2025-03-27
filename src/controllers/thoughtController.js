import { User, Thought } from '../models/index.js';

// GET to get all thoughts
export const getAllThoughts = async (_req, res) => {
    try {
        const thoughts = await Thought.find();
        res.json(thoughts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET to get a single thought by its _id
export const getThoughtById = async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId);

        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this ID' });
        }

        res.json(thought);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST to create a new thought
export const createThought = async (req, res) => {
    try {
        const thought = await Thought.create(req.body);

        // Push the created thought's _id to the associated user's thoughts array
        await User.findByIdAndUpdate(
            req.body.userId,
            { $push: { thoughts: thought._id } },
            { new: true }
        );

        res.status(201).json(thought);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// PUT to update a thought by its _id
export const updateThought = async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this ID' });
        }

        res.json(thought);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE to remove a thought by its _id
export const deleteThought = async (req, res) => {
    try {
        const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this ID' });
        }

        // Remove the thought's _id from the associated user's thoughts array
        await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        );

        res.json({ message: 'Thought deleted!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST to create a reaction stored in a single thought's reactions array field
export const addReaction = async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $addToSet: { reactions: req.body } },
            { new: true, runValidators: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this ID' });
        }

        res.json(thought);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE to pull and remove a reaction by the reaction's reactionId value
export const removeReaction = async (req, res) => {
    try {
        const thought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought found with this ID' });
        }

        res.json(thought);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};