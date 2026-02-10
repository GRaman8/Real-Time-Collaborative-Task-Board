import { z } from 'zod';

export const createBoardSchema = z.object({
  name: z.string()
    .min(1, 'Board name is required')
    .max(100, 'Board name must be less than 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
});

export const updateBoardSchema = z.object({
  name: z.string()
    .min(1, 'Board name is required')
    .max(100, 'Board name must be less than 100 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
});