"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSessionSchema = new mongoose_1.Schema({
    username: {
        type: String,
    },
    googleId: {
        type: String,
    },
    role: {
        type: String,
        default: "user"
    },
    email: {
        type: String,
    },
    notifications: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Team' }],
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('UserSession', userSessionSchema);
