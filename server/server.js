import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRouter from './routes/auth.js';
import boardsRouter from './routes/boards.js';
import tasksRouter from './routes/tasks.js';
import { PORT, MONGO_URI } from './config.js';
import socketHandlers from './socket/socketHandlers.js';

const app = express();
const httpServer = createServer(app);

// Dynamic CORS: allow localhost for dev + your deployed frontend URL
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,  // Set this on Render to your Vercel URL
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Health check endpoint (keeps Render from sleeping + useful for monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// MongoDB Connection
if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in the .env file.");
  process.exit(1);
}

mongoose.connect(MONGO_URI);

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected');
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

mongoose.connection.on('open', () => {
  console.log('Connected to MongoDB');
});

// Initialize Socket.io handlers
socketHandlers(io);

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/boards', boardsRouter);
app.use('/api/v1/tasks', tasksRouter);

const port = PORT || 10000;
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

export default io;