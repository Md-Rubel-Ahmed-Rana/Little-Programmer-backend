// src/models/Invitation.ts
import { Schema, model, Document } from 'mongoose';
import { IInvitation } from '../interface/invitation.interface';



const invitationSchema = new Schema<IInvitation>({
  team: { 
    type: Schema.Types.ObjectId, 
    ref: 'Team', 
    required: true
   },
  user: {
     type: Schema.Types.ObjectId, 
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

export default model<IInvitation>('Invitation', invitationSchema);
