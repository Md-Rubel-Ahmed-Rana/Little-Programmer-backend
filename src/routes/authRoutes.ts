import express from 'express';
import { getUsers,getUser, loggedinUser, loginUser, registerUser } from '../controllers/userController';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.get('/loggedinUser', loggedinUser);
authRouter.get('/users', getUsers);
authRouter.get('/users/:id', getUser);




export default authRouter;
