"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/teamRoutes.ts
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controllers/teamController");
const teamRouter = express_1.default.Router();
// Create a team
teamRouter.post('/create-team', teamController_1.createTeam);
teamRouter.get('/my-team', teamController_1.getTeam);
// Invite a team member
teamRouter.post('/invite-member', teamController_1.inviteMember);
// Get active team members
teamRouter.get('/active-members/:teamId', teamController_1.getActiveMembers);
// Get pending team members
teamRouter.get('/pending-members/:teamId', teamController_1.getPendingMembers);
// Accept team invitation
teamRouter.post('/accept-invitation', teamController_1.acceptInvitation);
// Reject team invitation
teamRouter.post('/reject-invitation', teamController_1.rejectInvitation);
exports.default = teamRouter;
