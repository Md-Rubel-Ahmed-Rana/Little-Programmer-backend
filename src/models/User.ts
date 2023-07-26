import { Schema, model } from 'mongoose';
import IUser from '../interface/user.interface';

const userSchema = new Schema<IUser>({
  username: { 
    type: String, 
    required: true,
     unique: true 
    },
  email: { 
    type: String, 
    // required: true, 
    // unique: true 
  },
  password: { 
    type: String, 
   },
  role: {
    type: String,
    required: true,
  },
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Team'  }],
}, {
  timestamps: true
});

export default model<IUser>('User', userSchema);
