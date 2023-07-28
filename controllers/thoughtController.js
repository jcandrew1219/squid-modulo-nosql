const {User, Thought} = require("../models");
module.exports = {
    async getThoughts (req, res) {
        try {
          const thoughts = await Thought.find()
          res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleThought (req, res) {
        try {
          const thought = await Thought.findOne({ _id: req.params.thoughtId})
          .select('-__v');

          if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
          }

          res.json(thought);
        } catch (err) {
          res.status(500).json(err);
        }
    },
    async createThought (req, res) {
        try {
          const thought = await Thought.create(req.body);
          const user = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: thought._id } },
            { new: true }
          );

          if (!user) {
            return res.status(404).json({ message: 'thought created, but no user with this ID' });
          }
          
          res.json(thought);
        } catch (err) {
          res.status(500).json(err);
        }
    },
    async updateThought (req, res) {
        try {  
          const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
          );

          if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
          }
    
          res.json(thought);
        } catch (err) {
          res.status(500).json(err);
        }
    },
    async deleteThought (req, res) {
        try {
          const thought = await Thought.findOneAndDelete({_id: req.params.thoughtId});
          const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
          );

          if (!user) {
            return res.status(404).json({ message: 'thought deleted, but no user with this ID' });
          }
        
          res.json({message: 'Thought deleted!'});
        } catch (err) {
          res.status(500).json(err);
        }
    },
    async createReaction (req, res) {
        try {  
          const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: {reactions: req.body}},
            { runValidators: true, new: true }
          );

          if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
          }
    
          res.json(thought);
        } catch (err) {
          res.status(500).json(err);
        }
    },
    async deleteReaction (req, res) {
        try {  
          const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: {reactions: {reactionId: req.params.reactionId}}},
            { runValidators: true, new: true }
          );

          if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
          }
    
          res.json(thought);
        } catch (err) {
          res.status(500).json(err);
        }
    }
}