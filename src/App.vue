<template>
  <div class="min-h-screen font-sans bg-background text-foreground">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

:root {
  font-family: 'Inter', sans-serif;
}
</style>
