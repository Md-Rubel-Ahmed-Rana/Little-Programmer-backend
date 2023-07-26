// src/controllers/userController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully.'
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: 'User not found.'
       });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    const jwtPayload = {
      id: user._id,
      role: user.role,
      email: user.email,
      username: user.username
    }
    // Generate and send an access token (JWT)
    const accessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET as Secret, { expiresIn: '1d' });
    res.status(200).json({ 
      accessToken,
      data:  user,
      success: true,
      message: "User logged in successfully!"
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

const loggedinUser = async (
  req: Request,
  res: Response,
) => {
  try {
    const token = req.headers.authorization as string;
    if(!token){
      return res.status(200).json({
        success: false,
        message: "Token not provided",
        data: null,
      })
    }
  
        
    const isVerifiedUser = await jwt.verify(
      token,
      process.env.JWT_SECRET as Secret
    );
    if(!isVerifiedUser){
      return res.status(200).json({
        success: false,
        message: "Invalid token",
        data: null,
      })
    }
    const user = await User.findById(isVerifiedUser?.id as string).populate("notifications")
    if(!user){
      return res.status(200).json({
        success: false,
        message: "User not found!",
        data: null,
      })
    }
    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "User found",
      data: user,
    });
  } catch (error) {
    console.log(error)
  }
};

const getUsers = async (req: Request, res: Response) =>{
  try {
    const users = await User.find({role: "user"})
    res.status(200).json({
      success: true,
      message: "Users found!",
      data: users
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
}
const getUser = async (req: Request, res: Response) =>{
  try {
    const user = await User.findById(req.params.id)
    res.status(200).json({
      success: true,
      message: "User found!",
      data: user
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export { registerUser, loginUser, loggedinUser, getUsers , getUser};
