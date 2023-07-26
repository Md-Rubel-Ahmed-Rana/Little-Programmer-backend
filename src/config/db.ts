// src/config/db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbURI = process.env.MONGODB_URI as string

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('MongoDB connected!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
