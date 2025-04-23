import { apiFetch } from './api'
import type { Category } from '@/types/categories'

export async function getCategories(params = ''): Promise<{ data: Category[] | null}> {
  return apiFetch(`/categories?${params}`)
}