import {Request, Response} from "express"
import Team from "../models/Team";
import User from "../models/User";
import Invitation from "../models/Invitation";

const createTeam = async (req: Request, res: Response) => {
    try {
      const { name, category, admin } = req.body;
  
      // Check if the team name already exists
      const existingTeam = await Team.findOne({ name: name });
      if (existingTeam) {
        return res.status(200).json({
          success: false,
          message: 'Team name already in use.'
          });
      }
  
      // Create a new team and save it to the database
      const newTeam = new Team({ name,category, admin });
      await newTeam.save();
  
      res.status(201).json({
        success: true,
        message: 'Team created successfully.'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error.', 
       });
    }
}

const getTeam = async (req: Request, res: Response) => {
    try {
      const admin = req.query.admin;
  
      // Check if the team name already exists
      const team = await Team.find({admin: admin})
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
    } catch (error) {
      console.error('Error creating team:', error);
      res.status(500).json({ message: 'Internal server error.', error });
    }
}

const inviteMember  = async (req: Request, res: Response) => {
    try {
      // send notification to the user
      const { team, user } = req.body;
      const isUserExist = await User.findById(user);
      if (!isUserExist) {
        return res.status(404).json({ 
          success: false,
          message: 'User not found.'
         });
      }

      global.io.on("connection", (socket: { on: (arg0: string, arg1: (data: any) => void) => void; broadcast: { emit: (arg0: string, arg1: any) => void; }; }) => {
         socket.on("sendNotification", (data) => {
          socket.broadcast.emit("receiveNotification",  data)
         })
      })
  

  
      const isTeamExist = await Team.findById(team);
      if (isTeamExist?.members.includes(isUserExist._id)) {
        return res.status(409).json({ 
          success: false,
          message: 'User is already a member of the team.' 
        });
      }


  
      const existingInvitation = await Invitation.findOne({ team, user });
      if (existingInvitation) {
        return res.status(200).json({
          success: false,
          message: 'Invitation already sent to the user.'
         });
      }
  
      const newInvitation = new Invitation({ team, user });
      await newInvitation.save();

      
      
  await User.findByIdAndUpdate(isUserExist._id, { $push: { notifications: isTeamExist?._id}}, {upsert: true, new: true})

   
  
      res.status(201).json({ 
        success: true,
        message: 'Invitation sent successfully.'
       });
    } catch (error) {
      console.error('Error inviting team member:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
}

const getActiveMembers = async (req: Request, res: Response) => {
try {
    const teamId = req.params.teamId;

    const team = await Team.findById(teamId).populate('members');

    if (!team) {
    return res.status(404).json({ message: 'Team not found.' });
    }

    res.status(200).json({ members: team.members });
} catch (error) {
    console.error('Error retrieving active team members:', error);
    res.status(500).json({ message: 'Internal server error.' });
}
}

const getPendingMembers = async (req: Request, res: Response) => {
try {
    const teamId = req.params.teamId;

    // Find all invitations for the team with 'pending' status and populate the user details
    const invitations = await Invitation.find({ team: teamId, status: 'pending' }).populate('user', 'username email');

    if (!invitations) {
    return res.status(404).json({ message: 'Invitations not found.' });
    }

    res.status(200).json({ invitations });
} catch (error) {
    console.error('Error retrieving pending team members:', error);
    res.status(500).json({ message: 'Internal server error.' });
}
}

const acceptInvitation = async (req: Request, res: Response) => {
    try {
      const { invitationId, userId } = req.body;
  
      // Find the invitation and update its status to 'accepted'
      const invitation = await Invitation.findByIdAndUpdate(invitationId, { status: 'accepted' });
  
      if (!invitation) {
        return res.status(404).json({ message: 'Invitation not found.' });
      }
  
      // Add the user to the team's members list
      await Team.findByIdAndUpdate(invitation.team, { $push: { members: userId } });
  
      res.status(200).json({
        success: true,
        message: 'Invitation accepted successfully.'
      });
    } catch (error) {
      console.error('Error accepting team invitation:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
}

const rejectInvitation = async (req: Request, res: Response) => {
    try {
      const { invitationId } = req.body;
      await Invitation.findByIdAndUpdate(invitationId, { status: 'rejected' });
      res.status(200).json({ 
        success: true,
        message: 'Invitation rejected successfully.'
       });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Internal server error.'
       });
    }
}

export {createTeam, inviteMember, getActiveMembers, getPendingMembers, acceptInvitation, rejectInvitation, getTeam}