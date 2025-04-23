import { apiFetch } from './api'
import type { LoginPayload, RegisterPayload, AuthResponse } from '@/types/auth'

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/local', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/local/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
