import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DragDropContext } from 'react-beautiful-dnd';
import { currentBoardAtom } from '../store/boardAtom';
import {
  tasksAtom,
  tasksLoadingAtom,
  todoTasksSelector,
  inProgressTasksSelector,
  doneTasksSelector,
} from '../store/taskAtom';
import { getBoard } from '../api/boards';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import useSocket from '../hooks/useSocket';
import TaskColumn from '../components/task/TaskColumn';
import CreateTaskModal from '../components/task/CreateTaskModal';
import EditTaskModal from '../components/task/EditTaskModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function BoardDetailPage() {
  const { id: boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useRecoilState(currentBoardAtom);
  const [tasks, setTasks] = useRecoilState(tasksAtom);
  const [loading, setLoading] = useRecoilState(tasksLoadingAtom);

  const todoTasks = useRecoilValue(todoTasksSelector);
  const inProgressTasks = useRecoilValue(inProgressTasksSelector);
  const doneTasks = useRecoilValue(doneTasksSelector);

  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [error, setError] = useState('');

  const { emitTaskCreated, emitTaskUpdated, emitTaskDeleted, emitTaskMoved } =
    useSocket(boardId);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [boardData, tasksData] = await Promise.all([
        getBoard(boardId),
        getTasks(boardId),
      ]);
      setBoard(boardData);
      setTasks(tasksData);
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 403) {
        navigate('/boards');
      } else {
        setError('Failed to load board');
      }
    } finally {
      setLoading(false);
    }
  }, [boardId, setBoard, setTasks, setLoading, navigate]);

  useEffect(() => {
    fetchData();
    return () => {
      setBoard(null);
      setTasks([]);
    };
  }, [fetchData, setBoard, setTasks]);

  const handleCreateTask = async (payload) => {
    const newTask = await createTask(payload);
    setTasks((prev) => [...prev, newTask]);
    emitTaskCreated(newTask);
  };

  const handleUpdateTask = async (taskId, data) => {
    const updated = await updateTask(taskId, data);
    setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
    emitTaskUpdated(updated);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      emitTaskDeleted(taskId);
    } catch {
      setError('Failed to delete task');
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newStatus = destination.droppableId;
    const newPosition = destination.index;

    // Optimistic update
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t._id === draggableId
          ? { ...t, status: newStatus, position: newPosition }
          : t
      );
      return updated;
    });

    // Persist + broadcast
    try {
      await updateTask(draggableId, { status: newStatus, position: newPosition });
      emitTaskMoved(draggableId, newStatus, newPosition);
    } catch {
      // Revert on failure
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Board header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/boards')}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{board?.name || 'Board'}</h1>
              {board?.description && (
                <p className="text-sm text-slate-500 mt-0.5">{board.description}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl hover:from-sky-600 hover:to-indigo-600 transition-all shadow-lg shadow-sky-200/50 self-start sm:self-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Task
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Kanban columns */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <TaskColumn
              status="todo"
              tasks={todoTasks}
              onEditTask={setEditTask}
              onDeleteTask={handleDeleteTask}
            />
            <TaskColumn
              status="in-progress"
              tasks={inProgressTasks}
              onEditTask={setEditTask}
              onDeleteTask={handleDeleteTask}
            />
            <TaskColumn
              status="done"
              tasks={doneTasks}
              onEditTask={setEditTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </DragDropContext>
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreateTask}
        boardId={boardId}
      />
      <EditTaskModal
        isOpen={!!editTask}
        onClose={() => setEditTask(null)}
        onSubmit={handleUpdateTask}
        task={editTask}
      />
    </div>
  );
}
