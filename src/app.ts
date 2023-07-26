// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import teamRoutes from './routes/teamRoutes';
import cookieSession from "cookie-session"
import passport from 'passport'
import "./config/passport"
dotenv.config();
const app = express();
import http from 'http'
const server = http.createServer(app);
import { Server } from "socket.io"
import { googleAuthRoutes } from './routes/googleAuth';
const io = new Server(server,{
  cors: {
    origin: "https://little-programmer.netlify.app/",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://little-programmer.netlify.app/",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);


// Database connection
connectDB();


// set the io global
global.io = io as any

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());


// base route 
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Little programmer server is running"
  })
})

// Routes
app.use('/auth', googleAuthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);

export default server
