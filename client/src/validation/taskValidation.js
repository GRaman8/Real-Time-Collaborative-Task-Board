import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string()
    .min(1, 'Task title is required')
    .max(200, 'Task title must be less than 200 characters')
    .trim(),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  status: z.enum(['todo', 'in-progress', 'done'], {
    errorMap: () => ({ message: 'Invalid status' })
  }).default('todo'),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Invalid priority' })
  }).default('medium'),
  tags: z.string()
    .optional()
    .or(z.literal(''))
});

export const updateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Task title is required')
    .max(200, 'Task title must be less than 200 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags').optional(),
  position: z.number().int().min(0).optional()
});