<template>
  <AuthLayout>
    <form @submit.prevent="onSubmit" class="max-w-md w-full p-8 rounded-xl shadow-lg bg-neutral">
      <h2 class="text-2xl font-semibold mb-4">Login</h2>

      <div class="mb-4">
        <label for="email" class="block font-medium">Email</label>
        <Input
          id="email"
          v-model="identifier"
          type="email"
          placeholder="your@email.com"
        />
        <p class="text-red-500 text-sm mt-1" v-if="errors.identifier">
          {{ errors.identifier }}
        </p>
      </div>

      <div class="mb-4">
        <label for="password" class="block font-medium">Password</label>
        <Input
          id="password"
          v-model="password"
          type="password"
          placeholder="******"
        />
        <p class="text-red-500 text-sm mt-1" v-if="errors.password">
          {{ errors.password }}
        </p>
      </div>

      <p class="text-red-500 text-sm mb-4" v-if="error">{{ error }}</p>

      <Button type="submit" :disabled="loading" class="w-full text-white">
        {{ loading ? 'Logging in...' : 'Login' }}
      </Button>

      <p class="mt-4 text-center text-sm" style="color: var(--color-dark)">
        Don't have an account?
        <router-link to="/register" class="font-semibold" style="color: var(--color-primary)">
          Register
        </router-link>
      </p>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod';
import * as zod from 'zod';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import AuthLayout from '@/layouts/AuthLayout.vue'

const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

const validationSchema = toTypedSchema(
  zod.object({
    identifier: zod.string().min(1, { message: 'This is required' }).email({ message: 'Must be a valid email' }),
    password: zod.string().min(1, { message: 'This is required' }).min(8, { message: 'Too short' }),
  })
);


const { handleSubmit, errors } = useForm({
  validationSchema,
});

const { value: identifier } = useField<string>('identifier')
const { value: password } = useField<string>('password')


const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(values.identifier, values.password) 
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>
