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
exports.getTeam = exports.rejectInvitation = exports.acceptInvitation = exports.getPendingMembers = exports.getActiveMembers = exports.inviteMember = exports.createTeam = void 0;
const Team_1 = __importDefault(require("../models/Team"));
const User_1 = __importDefault(require("../models/User"));
const Invitation_1 = __importDefault(require("../models/Invitation"));
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, category, admin } = req.body;
        // Check if the team name already exists
        const existingTeam = yield Team_1.default.findOne({ name: name });
        if (existingTeam) {
            return res.status(200).json({
                success: false,
                message: 'Team name already in use.'
            });
        }
        // Create a new team and save it to the database
        const newTeam = new Team_1.default({ name, category, admin });
        yield newTeam.save();
        res.status(201).json({
            success: true,
            message: 'Team created successfully.'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
});
exports.createTeam = createTeam;
const getTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.query.admin;
        // Check if the team name already exists
        const team = yield Team_1.default.find({ admin: admin });
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found',
                data: null
            });
        }
        res.status(201).json({
            success: false,
            message: 'Team  found',
            data: team
        });
    }
    catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({ message: 'Internal server error.', error });
    }
});
exports.getTeam = getTeam;
const inviteMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // send notification to the user
        const { team, user } = req.body;
        const isUserExist = yield User_1.default.findById(user);
        if (!isUserExist) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }
        global.io.on("connection", (socket) => {
            socket.on("sendNotification", (data) => {
                socket.broadcast.emit("receiveNotification", data);
            });
        });
        const isTeamExist = yield Team_1.default.findById(team);
        if (isTeamExist === null || isTeamExist === void 0 ? void 0 : isTeamExist.members.includes(isUserExist._id)) {
            return res.status(409).json({
                success: false,
                message: 'User is already a member of the team.'
            });
        }
        const existingInvitation = yield Invitation_1.default.findOne({ team, user });
        if (existingInvitation) {
            return res.status(200).json({
                success: false,
                message: 'Invitation already sent to the user.'
            });
        }
        const newInvitation = new Invitation_1.default({ team, user });
        yield newInvitation.save();
        yield User_1.default.findByIdAndUpdate(isUserExist._id, { $push: { notifications: isTeamExist === null || isTeamExist === void 0 ? void 0 : isTeamExist._id } }, { upsert: true, new: true });
        res.status(201).json({
            success: true,
            message: 'Invitation sent successfully.'
        });
    }
    catch (error) {
        console.error('Error inviting team member:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.inviteMember = inviteMember;
const getActiveMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamId = req.params.teamId;
        const team = yield Team_1.default.findById(teamId).populate('members');
        if (!team) {
            return res.status(404).json({ message: 'Team not found.' });
        }
        res.status(200).json({ members: team.members });
    }
    catch (error) {
        console.error('Error retrieving active team members:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.getActiveMembers = getActiveMembers;
const getPendingMembers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamId = req.params.teamId;
        // Find all invitations for the team with 'pending' status and populate the user details
        const invitations = yield Invitation_1.default.find({ team: teamId, status: 'pending' }).populate('user', 'username email');
        if (!invitations) {
            return res.status(404).json({ message: 'Invitations not found.' });
        }
        res.status(200).json({ invitations });
    }
    catch (error) {
        console.error('Error retrieving pending team members:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.getPendingMembers = getPendingMembers;
const acceptInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invitationId, userId } = req.body;
        // Find the invitation and update its status to 'accepted'
        const invitation = yield Invitation_1.default.findByIdAndUpdate(invitationId, { status: 'accepted' });
        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found.' });
        }
        // Add the user to the team's members list
        yield Team_1.default.findByIdAndUpdate(invitation.team, { $push: { members: userId } });
        res.status(200).json({
            success: true,
            message: 'Invitation accepted successfully.'
        });
    }
    catch (error) {
        console.error('Error accepting team invitation:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
exports.acceptInvitation = acceptInvitation;
const rejectInvitation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invitationId } = req.body;
        yield Invitation_1.default.findByIdAndUpdate(invitationId, { status: 'rejected' });
        res.status(200).json({
            success: true,
            message: 'Invitation rejected successfully.'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
});
exports.rejectInvitation = rejectInvitation;
