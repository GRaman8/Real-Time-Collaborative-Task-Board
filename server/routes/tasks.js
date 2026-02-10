import { Router } from 'express';
import Task from '../models/Task.js';
import Board from '../models/Board.js';
import authMiddleware from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import { createTaskSchema, updateTaskSchema, taskIdSchema, boardIdParamSchema } from '../validation/taskValidation.js';

const router = Router();

// @route   GET /api/tasks/:boardId
// @desc    Get all tasks for a board
router.get('/:boardId', authMiddleware, validate(boardIdParamSchema, 'params'), async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    const tasks = await Task.find({ board: req.params.boardId })
      .populate('assignedTo', 'name email')
      .sort({ position: 1 });
    
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route   POST /api/tasks
// @desc    Create a task
router.post('/', authMiddleware, validate(createTaskSchema), async (req, res) => {
  const { title, description, status, priority, board, tags } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      status,
      priority,
      board,
      tags,
      assignedTo: req.userId,
    });

    const task = await newTask.save();
    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email');
    
    res.json(populatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
router.put('/:id', authMiddleware, validate(taskIdSchema, 'params'), validate(updateTaskSchema), async (req, res) => {
    
    const { title, description, status, priority, tags, position } = req.body;
    
    try {
      let task = await Task.findById(req.params.id);
      
      if (!task) {
        return res.status(404).json({ msg: 'Task not found' });
      }

      // Build update object
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (tags !== undefined) updateData.tags = tags;
      if (position !== undefined) updateData.position = position;
      updateData.updatedAt = Date.now();

      task = await Task.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      ).populate('assignedTo', 'name email');

      res.json(task);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


// @route   DELETE /api/tasks/:id
// @desc    Delete task
router.delete('/:id', authMiddleware, validate(taskIdSchema, 'params'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ msg: 'Task removed', id: req.params.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;