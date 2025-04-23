import { defineStore } from 'pinia'
import { loginUser, registerUser } from '@/services/auth'
import router from '@/router'

interface User {
  id: number
  username: string
  email: string
}

interface AuthState {
  user: User | null
  token: string
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') ?? '',
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(identifier: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const data = await loginUser({ identifier, password })

        this.token = data.jwt
        this.user = data.user

        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))

        router.push('/')
      } catch (err: any) {
        this.error = err.message || 'Login failed'
      } finally {
        this.loading = false
      }
    },

    async register(username: string, email: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const data = await registerUser({ username, email, password })

        this.token = data.jwt
        this.user = data.user

        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))

        router.push('/')
      } catch (err: any) {
        this.error = err.message || 'Registration failed'
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    },
  },
})
