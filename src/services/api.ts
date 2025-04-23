const BASE_URL = 'https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api'

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error?.message || 'API error')
  }
  if (res.status === 204) {
    return {} as T;
  }

  return res.json()
}