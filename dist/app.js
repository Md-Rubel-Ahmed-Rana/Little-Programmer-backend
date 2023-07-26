"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
require("./config/passport");
dotenv_1.default.config();
const app = (0, express_1.default)();
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app);
const socket_io_1 = require("socket.io");
const googleAuth_1 = require("./routes/googleAuth");
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "https://little-programmer.netlify.app/",
        methods: ["GET", "POST"]
    }
});
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "https://little-programmer.netlify.app/",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));
// Database connection
(0, db_1.default)();
// set the io global
global.io = io;
app.use((0, cookie_session_1.default)({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// base route 
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Little programmer server is running"
    });
});
// Routes
app.use('/auth', googleAuth_1.googleAuthRoutes);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/team', teamRoutes_1.default);
exports.default = server;
