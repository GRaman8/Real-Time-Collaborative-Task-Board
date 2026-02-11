import { z } from 'zod';

// Create board schema
const createBoardSchema = z.object({
  name: z.string().min(1, 'Board name is required')
    .max(100, 'Board name must be less than 100 characters')
    .trim(),
  description: z.string().max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal(''))
});

// Update board schema
const updateBoardSchema = z.object({
  name: z.string().min(1, 'Board name is required')
    .max(100, 'Board name must be less than 100 characters')
    .trim()
    .optional(),
  description: z.string().max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal(''))
});

// Board ID parameter schema
const boardIdSchema = z.object({
  id: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid board ID format')
});

export {
  createBoardSchema,
  updateBoardSchema,
  boardIdSchema
};