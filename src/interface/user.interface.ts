import { ObjectId } from "mongoose";
interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role : string,
    notifications: ObjectId
}

export default IUser