import useSWR from 'swr'
import { Label, CreateLabelInput } from '@/src/lib/api'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useLabels() {
  const { data, error, isLoading, mutate } = useSWR<Label[]>('/api/labels', fetcher)

  return {
    labels: data || [],
    isLoading,
    error,
    mutate
  }
}

export async function createLabel(input: CreateLabelInput) {
  const response = await fetch('/api/labels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.details || 'Failed to create label')
  }

  return response.json()
}
