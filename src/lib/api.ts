import { z } from 'zod'

// Task schemas
export const TaskStatus = z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
export const Priority = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: TaskStatus.optional().default('TODO'),
  priority: Priority.optional().default('MEDIUM'),
  dueAt: z.string().datetime().optional(),
  projectId: z.string().optional(),
  labelIds: z.array(z.string()).optional().default([])
})

export const UpdateTaskSchema = CreateTaskSchema.partial()

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: TaskStatus,
  priority: Priority,
  dueAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  projectId: z.string().nullable(),
  project: z.object({
    id: z.string(),
    name: z.string(),
    color: z.string().nullable()
  }).nullable().optional(),
  labels: z.array(z.object({
    id: z.string(),
    name: z.string(),
    color: z.string()
  })).optional(),
  comments: z.array(z.object({
    id: z.string(),
    content: z.string(),
    createdAt: z.string().datetime()
  })).optional()
})

// Project schemas
export const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().optional().default('#3B82F6')
})

export const UpdateProjectSchema = CreateProjectSchema.partial()

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  color: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  tasks: z.array(TaskSchema).optional()
})

// Label schemas
export const CreateLabelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().optional().default('#6B7280')
})

export const LabelSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

// Comment schemas
export const CreateCommentSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  taskId: z.string().min(1, 'Task ID is required')
})

export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  taskId: z.string()
})

// API Response types
export type Task = z.infer<typeof TaskSchema>
export type Project = z.infer<typeof ProjectSchema>
export type Label = z.infer<typeof LabelSchema>
export type Comment = z.infer<typeof CommentSchema>

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>
export type CreateLabelInput = z.infer<typeof CreateLabelSchema>
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>
