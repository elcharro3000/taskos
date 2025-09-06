import useSWR from 'swr'
import { Project, CreateProjectInput, UpdateProjectInput } from '@/src/lib/api'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR<Project[]>('/api/projects', fetcher)

  return {
    projects: data || [],
    isLoading,
    error,
    mutate
  }
}

export function useProject(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Project>(
    id ? `/api/projects/${id}` : null,
    fetcher
  )

  return {
    project: data,
    isLoading,
    error,
    mutate
  }
}

export async function createProject(input: CreateProjectInput) {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.details || 'Failed to create project')
  }

  return response.json()
}

export async function updateProject(id: string, input: UpdateProjectInput) {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.details || 'Failed to update project')
  }

  return response.json()
}

export async function deleteProject(id: string) {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to delete project')
  }

  return response.json()
}
