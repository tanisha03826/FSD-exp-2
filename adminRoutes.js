 const express = require("express");

const router = express.Router();

const User = require("../models/User");
const Post = require("../models/Post");

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
    "/users",
    verifyToken,
    adminMiddleware,
    async (req, res) => {

        try {

            const users = await User.find();

            res.status(200).json(users);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);

router.get(
    "/posts",
    verifyToken,
    adminMiddleware,
    async (req, res) => {

        try {

            const posts = await Post.find();

            res.status(200).json(posts);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);

router.delete(
    "/user/:id",
    verifyToken,
    adminMiddleware,
    async (req, res) => {

        try {

            // Find user first
            const user = await User.findById(req.params.id);

            if (!user) {

                return res.status(404).json({
                    message: "User not found"
                });

            }


            // Prevent admin from deleting their own account
            if (user._id.toString() === req.user.id.toString()) {

                return res.status(400).json({
                    message: "You cannot delete your own admin account"
                });

            }


            // Delete user
            await User.findByIdAndDelete(req.params.id);


            res.status(200).json({
                message: "User Deleted Successfully"
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);

router.delete(
    "/post/:id",
    verifyToken,
    adminMiddleware,
    async (req, res) => {

        try {

            // Check whether post exists
            const post = await Post.findById(req.params.id);

            if (!post) {

                return res.status(404).json({
                    message: "Post not found"
                });

            }


            // Delete post
            await Post.findByIdAndDelete(req.params.id);


            res.status(200).json({
                message: "Post Deleted Successfully"
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);


module.exports = router;
