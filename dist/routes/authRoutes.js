"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authRouter = express_1.default.Router();
authRouter.post('/register', userController_1.registerUser);
authRouter.post('/login', userController_1.loginUser);
authRouter.get('/loggedinUser', userController_1.loggedinUser);
authRouter.get('/users', userController_1.getUsers);
authRouter.get('/users/:id', userController_1.getUser);
exports.default = authRouter;
