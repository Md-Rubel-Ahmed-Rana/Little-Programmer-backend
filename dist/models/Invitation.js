"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Invitation.ts
const mongoose_1 = require("mongoose");
const invitationSchema = new mongoose_1.Schema({
    team: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Invitation', invitationSchema);
