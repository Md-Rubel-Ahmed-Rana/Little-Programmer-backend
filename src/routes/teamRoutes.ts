// src/routes/teamRoutes.ts
import express, { Request, Response } from 'express';
import { acceptInvitation, createTeam, getActiveMembers, getPendingMembers, getTeam, inviteMember, rejectInvitation } from '../controllers/teamController';

const teamRouter = express.Router();

// Create a team
teamRouter.post('/create-team', createTeam);
teamRouter.get('/my-team', getTeam);

// Invite a team member
teamRouter.post('/invite-member', inviteMember);

// Get active team members
teamRouter.get('/active-members/:teamId', getActiveMembers);

// Get pending team members
teamRouter.get('/pending-members/:teamId', getPendingMembers);

// Accept team invitation
teamRouter.post('/accept-invitation', acceptInvitation);

// Reject team invitation
teamRouter.post('/reject-invitation', rejectInvitation);

export default teamRouter;
