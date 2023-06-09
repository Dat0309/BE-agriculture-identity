import express from "express";
import asyncHandler from "express-async-handler";
import { protect, admin } from "../Middleware/AuthMiddleware.js";
import User from "../Models/user.js";
import generateToken from "../utils/generateToken.js";

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Login User.
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: integer
 *                       description: The username.
 *                       example: dat09
 *                     password:
 *                       type: string
 *                       description: The user's password.
 *                       example: dat09
*/
userRouter.post(
    "/login",
    asyncHandler(async (req, res) => {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                admin: user.admin,
                token: generateToken(user._id),
                createdAt: user.createdAt,
            });
        } else {
            res.status(401);
            throw new Error("Invalid username of password");
        }
    })
);

/**
 * @swagger
 * /scatter:
 *   post:
 *    description: Register function
 */
userRouter.post(
    "/",
    asyncHandler(async (req, res) => {
        const {
            first_name,
            last_name,
            username,
            password,
            avatar,
            admin
        } = req.body;

        const userExits = await User.findOne({ username });

        if (userExits) {
            res.status(400);
            throw new Error("Username is exists");
        }

        const user = await User.create({
            first_name,
            last_name,
            username,
            password,
            avatar,
            admin,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                password: user.password,
                avatar: user.avatar,
                admin: user.admin,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    })
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a entity of JSONPlaceholder users.
 *     description: Retrieve a entity of users from JSONPlaceholder. Can be used to populate a list of fake users when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A profile of user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   items:
 *                     type: object
 */
userRouter.get(
    "/profile",
    protect,
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                password: user.password,
                avatar: user.avatar,
                admin: user.admin,
                createdAt: user.createdAt,
            });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    })
);

/**
 * @swagger
 * /scatter:
 *   post:
 *    description:  Update profile
 */
userRouter.put(
    "/profile",
    protect,
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);

        if (user) {
            user.first_name = req.body.first_name || user.first_name;
            user.last_name = req.body.last_name || user.last_name;
            user.username = req.body.username || user.username;
            user.password = req.body.password || user.password;
            user.avatar = req.body.avatar || user.avatar;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                username: updatedUser.username,
                password: updatedUser.password,
                avatar: updatedUser.avatar,
                createdAt: updatedUser.createdAt,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    })
);

export default userRouter;