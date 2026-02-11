import { z } from 'zod';

// Task status enum
const taskStatusEnum = z.enum(['todo', 'in-progress', 'done'], {
  errorMap: () => ({ message: 'Status must be todo, in-progress, or done' })
});

// Task priority enum
const taskPriorityEnum = z.enum(['low', 'medium', 'high'], {
  errorMap: () => ({ message: 'Priority must be low, medium, or high' })
});

// Create task schema
const createTaskSchema = z.object({
  title: z.string()
    .min(1, 'Task title is required')
    .max(200, 'Task title must be less than 200 characters')
    .trim(),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  status: taskStatusEnum.default('todo'),
  priority: taskPriorityEnum.default('medium'),
  board: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid board ID format'),
  tags: z.array(z.string().trim())
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .default([])
});

// Update task schema
const updateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Task title is required')
    .max(200, 'Task title must be less than 200 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  tags: z.array(z.string().trim())
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  position: z.number()
    .int()
    .min(0)
    .optional()
});

// Task ID parameter schema
const taskIdSchema = z.object({
  id: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid task ID format')
});

// Board ID parameter schema for tasks
const boardIdParamSchema = z.object({
  boardId: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid board ID format')
});

export {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  boardIdParamSchema
};