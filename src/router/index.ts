import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/pages/auth/Login.vue'
import Register from '@/pages/auth/Register.vue'
import ArticleList from '@/pages/articles/List.vue'
import ArticleDetail from '@/pages/articles/Detail.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/articles/:id', name: 'ArticleDetail', component: ArticleDetail },
  { path: '/', name: 'ArticleList', component: ArticleList },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') || localStorage.getItem('user')

  if (!isAuthenticated && to.name !== 'Login' && to.name !== 'Register') {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
