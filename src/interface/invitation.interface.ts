import { ObjectId } from "mongoose";

export interface IInvitation extends Document {
    team: ObjectId;
    user: ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
}