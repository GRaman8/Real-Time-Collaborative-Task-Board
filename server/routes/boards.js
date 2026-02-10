import { Router } from 'express';
import Board from '../models/Board.js';
import authMiddleware from '../middleware/auth.js';
import validate from '../middleware/validation.js';
import { createBoardSchema,updateBoardSchema, boardIdSchema } from '../validation/boardValidation.js';

const router = Router();

// @route   GET /api/v*/boards
// @desc    Get all boards for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.userId }, { members: req.userId }]
    }).populate('owner', 'name email').populate('members', 'name email');
    
    res.json(boards);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/v*/boards
// @desc    Create a board
router.post('/', authMiddleware, validate(createBoardSchema), async (req, res) => {
  const { name, description } = req.body;

  try {
    const newBoard = new Board({
      name,
      description,
      owner: req.userId,
      members: [req.userId],
    });

    const board = await newBoard.save();
    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/v*/boards/:id
// @desc    Get board by ID
router.get('/:id', authMiddleware, validate(boardIdSchema, 'params'), async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');
    
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    // Check if user has access
    const hasAccess = board.owner._id.toString() === req.userId || 
                      board.members.some(m => m._id.toString() === req.userId);
    
    if (!hasAccess) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/v*/boards/:id
// @desc    Update board
router.put('/:id', authMiddleware, validate(boardIdSchema, 'params'), validate(updateBoardSchema),async (req, res) => {

    const { name, description } = req.body;

    try {
      let board = await Board.findById(req.params.id);
      
      if (!board) {
        return res.status(404).json({ msg: 'Board not found' });
      }

      // Check ownership
      if (board.owner.toString() !== req.userId) {
        return res.status(403).json({ msg: 'Not authorized' });
      }

      // Build update object
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;

      board = await Board.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      );

      res.json(board);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE /api/v*/boards/:id
// @desc    Delete board
router.delete('/:id', authMiddleware, validate(boardIdSchema, 'params'), async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    if (board.owner.toString() !== req.userId) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await board.deleteOne();
    res.json({ msg: 'Board removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;