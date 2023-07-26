// src/models/Team.ts
import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  admin: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User'  }],
},{
  timestamps: true
});

export default model('Team', teamSchema);
