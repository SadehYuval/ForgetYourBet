import mongoose from 'mongoose';
import 'dotenv/config'

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('MONGODB_URI environment variable not set');
}

export const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
