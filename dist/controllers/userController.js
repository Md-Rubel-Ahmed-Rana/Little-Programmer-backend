"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getUsers = exports.loggedinUser = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = yield User_1.default.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already in use.' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.default({ username, email, password: hashedPassword, role });
        yield newUser.save();
        res.status(201).json({
            success: true,
            message: 'User registered successfully.'
        });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(200).json({
                success: false,
                message: 'User not found.'
            });
        }
        // Check if the password is correct
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password.' });
        }
        const jwtPayload = {
            id: user._id,
            role: user.role,
            email: user.email,
            username: user.username
        };
        // Generate and send an access token (JWT)
        const accessToken = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            accessToken,
            data: user,
            success: true,
            message: "User logged in successfully!"
        });
    }
    catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.loginUser = loginUser;
const loggedinUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(200).json({
                success: false,
                message: "Token not provided",
                data: null,
            });
        }
        const isVerifiedUser = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!isVerifiedUser) {
            return res.status(200).json({
                success: false,
                message: "Invalid token",
                data: null,
            });
        }
        const user = yield User_1.default.findById(isVerifiedUser === null || isVerifiedUser === void 0 ? void 0 : isVerifiedUser.id).populate("notifications");
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "User not found!",
                data: null,
            });
        }
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "User found",
            data: user,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.loggedinUser = loggedinUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({ role: "user" });
        res.status(200).json({
            success: true,
            message: "Users found!",
            data: users
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id);
        res.status(200).json({
            success: true,
            message: "User found!",
            data: user
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.getUser = getUser;
