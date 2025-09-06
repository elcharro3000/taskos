import useSWR from 'swr'
import { Task, CreateTaskInput, UpdateTaskInput } from '@/src/lib/api'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useTasks() {
  const { data, error, isLoading, mutate } = useSWR<Task[]>('/api/tasks', fetcher)

  return {
    tasks: data || [],
    isLoading,
    error,
    mutate
  }
}

export function useTask(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Task>(
    id ? `/api/tasks/${id}` : null,
    fetcher
  )

  return {
    task: data,
    isLoading,
    error,
    mutate
  }
}

export function useInboxTasks() {
  const { tasks, isLoading, error, mutate } = useTasks()
  
  const inboxTasks = tasks.filter(task => 
    !task.projectId || 
    (task.status === 'TODO' || task.status === 'IN_PROGRESS') && !task.dueAt
  )

  return {
    tasks: inboxTasks,
    isLoading,
    error,
    mutate
  }
}

export function useTodayTasks() {
  const { tasks, isLoading, error, mutate } = useTasks()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayTasks = tasks.filter(task => {
    if (!task.dueAt) return false
    const dueDate = new Date(task.dueAt)
    return dueDate >= today && dueDate < tomorrow
  })

  return {
    tasks: todayTasks,
    isLoading,
    error,
    mutate
  }
}

export function useOverdueTasks() {
  const { tasks, isLoading, error, mutate } = useTasks()
  
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const overdueTasks = tasks.filter(task => {
    if (!task.dueAt || task.status === 'COMPLETED') return false
    const dueDate = new Date(task.dueAt)
    return dueDate < now
  })

  return {
    tasks: overdueTasks,
    isLoading,
    error,
    mutate
  }
}

export async function createTask(input: CreateTaskInput) {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.details || 'Failed to create task')
  }

  return response.json()
}

export async function updateTask(id: string, input: UpdateTaskInput) {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.details || 'Failed to update task')
  }

  return response.json()
}

export async function deleteTask(id: string) {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete task')
  }

  return response.json()
}
