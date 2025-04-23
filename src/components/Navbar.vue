<template>
  <nav v-if="authStore.isAuthenticated" class="bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md py-4 z-20 w-full top-0 relative">
    <div class="container mx-auto flex items-center justify-between px-4">
      <router-link to="/">
        <div class="text-xl font-bold tracking-wide">
          TravelArticle
        </div>
      </router-link>

      <!-- Nav Menu -->
      <div class="hidden md:flex items-center space-x-6">
        <a @click.prevent="logout" class="text-white cursor-pointer">
          LOGOUT
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const logout = () => {
    authStore.logout()
  }
</script>

<style scoped>
@media screen and (max-width: 768px) {
  .relative {
    position: relative;
  }

  .absolute {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background-color: #292e36;
    z-index: 1000;
  }
}
</style>
