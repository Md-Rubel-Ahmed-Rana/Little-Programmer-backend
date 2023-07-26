import { Schema, model } from 'mongoose';

const userSessionSchema = new Schema({
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
  notifications: [{ type: Schema.Types.ObjectId, ref: 'Team'  }],
}, {
  timestamps: true
});

export default model('UserSession', userSessionSchema);
