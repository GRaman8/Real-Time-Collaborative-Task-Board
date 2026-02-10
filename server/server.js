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
const io = new Server(httpServer,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET","POST"],
        credentials: true
    },
    auth: {
      rejectUnauthorized: true
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection Section

if(!MONGO_URI){
    console.error("Error: MONGO_URI is not defined in the .env file.");
    process.exit(1); // Exit the process if the URI is missing
}

// Connect to MongoDB
mongoose.connect(MONGO_URI);

//Error Handling for MongoDB Connection
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

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}. http://localhost:${PORT}`);
});

export default io;
