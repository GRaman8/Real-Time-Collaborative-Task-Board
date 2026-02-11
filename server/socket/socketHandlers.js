import Task from '../models/Task.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export default function socketHandlers(io) {
  // Socket.io authentication middleware (similar to auth.js middleware)
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token || !token.startsWith('Bearer')) {
      return next(new Error('No token, authorization denied'));
    }

    const words = token.split(" ");
    const jwtToken = words[1];

    try {
      const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
      
      if (decodedValue.userId) {
        socket.userId = decodedValue.userId;
        next();
      } else {
        next(new Error('Invalid token structure'));
      }
    } catch (err) {
      next(new Error('Token is not valid'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected:`, socket.id);

    // Join a board room
    socket.on('join-board', (boardId, callback) => {
      try {
        socket.join(boardId);
        console.log(`Socket ${socket.id} joined board ${boardId}`);
        callback?.({ success: true });
      } catch (err) {
        console.error('Error joining board:', err);
        callback?.({ success: false, error: err.message });
      }
    });

    // Leave a board room
    socket.on('leave-board', (boardId, callback) => {
      try {
        socket.leave(boardId);
        console.log(`Socket ${socket.id} left board ${boardId}`);
        callback?.({ success: true });
      } catch (err) {
        console.error('Error leaving board:', err);
        callback?.({ success: false, error: err.message });
      }
    });

    // Task created
    socket.on('task-created', (data) => {
      try {
        socket.to(data.boardId).emit('task-created', data.task);
      } catch (err) {
        console.error('Error creating task:', err);
      }
    });

    // Task updated
    socket.on('task-updated', (data) => {
      try {
        socket.to(data.boardId).emit('task-updated', data.task);
      } catch (err) {
        console.error('Error updating task:', err);
      }
    });

    // Task deleted
    socket.on('task-deleted', (data) => {
      try {
        socket.to(data.boardId).emit('task-deleted', data.taskId);
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    });

    // Task moved (drag and drop)
    socket.on('task-moved', async (data) => {
      try {
        await Task.findByIdAndUpdate(data.taskId, {
          status: data.newStatus,
          position: data.newPosition,
          updatedAt: Date.now()
        });

        socket.to(data.boardId).emit('task-moved', data);
      } catch (err) {
        console.error('Error moving task:', err);
      }
    });

    // User typing indicator
    socket.on('user-typing', (data) => {
      try {
        socket.to(data.boardId).emit('user-typing', {
          userId: data.userId,
          userName: data.userName
        });
      } catch (err) {
        console.error('Error broadcasting typing:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected:`, socket.id);
    });
  });
};