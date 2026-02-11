import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useRecoilState } from 'recoil';
import { tasksAtom } from '../store/taskAtom';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function useSocket(boardId) {
  const socketRef = useRef(null);
  const [tasks, setTasks] = useRecoilState(tasksAtom);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !boardId) return;

    const socket = io(SOCKET_URL, {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-board', boardId, (response) => {
        if (response?.success) {
          console.log('Joined board room:', boardId);
        }
      });
    });

    socket.on('task-created', (task) => {
      setTasks((prev) => {
        if (prev.find(t => t._id === task._id)) return prev;
        return [...prev, task];
      });
    });

    socket.on('task-updated', (updatedTask) => {
      setTasks((prev) =>
        prev.map(t => t._id === updatedTask._id ? updatedTask : t)
      );
    });

    socket.on('task-deleted', (taskId) => {
      setTasks((prev) => prev.filter(t => t._id !== taskId));
    });

    socket.on('task-moved', (data) => {
      setTasks((prev) =>
        prev.map(t =>
          t._id === data.taskId
            ? { ...t, status: data.newStatus, position: data.newPosition }
            : t
        )
      );
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    return () => {
      if (socket.connected) {
        socket.emit('leave-board', boardId);
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [boardId, setTasks]);

  const emitTaskCreated = useCallback((task) => {
    socketRef.current?.emit('task-created', { boardId, task });
  }, [boardId]);

  const emitTaskUpdated = useCallback((task) => {
    socketRef.current?.emit('task-updated', { boardId, task });
  }, [boardId]);

  const emitTaskDeleted = useCallback((taskId) => {
    socketRef.current?.emit('task-deleted', { boardId, taskId });
  }, [boardId]);

  const emitTaskMoved = useCallback((taskId, newStatus, newPosition) => {
    socketRef.current?.emit('task-moved', {
      boardId,
      taskId,
      newStatus,
      newPosition,
    });
  }, [boardId]);

  return {
    emitTaskCreated,
    emitTaskUpdated,
    emitTaskDeleted,
    emitTaskMoved,
  };
}
