"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Team.ts
const mongoose_1 = require("mongoose");
const teamSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    admin: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Admin', required: true },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Team', teamSchema);
