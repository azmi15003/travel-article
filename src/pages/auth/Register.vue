<template>
	<AuthLayout>
		<form @submit.prevent="onSubmit"
			class="max-w-md w-full p-8 rounded-xl shadow-lg"
			style="background-color: var(--color-neutral);">
			
			<h2 class="text-3xl font-bold mb-6 text-center" style="color: var(--color-primary)">
				Create an Account
			</h2>

			<!-- Username -->
			<div class="mb-4">
				<label for="username" class="block font-medium mb-1" style="color: var(--color-dark)">Username</label>
				<input
					id="username"
					v-model="username"
					type="text"
					placeholder="yourname"
					class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
					style="background-color: white;"
				/>
				<p class="text-red-500 text-sm mt-1" v-if="errors.username">{{ errors.username }}</p>
			</div>

			<!-- Email -->
			<div class="mb-4">
				<label for="email" class="block font-medium mb-1" style="color: var(--color-dark)">Email</label>
				<input
					id="email"
					v-model="email"
					type="email"
					placeholder="you@example.com"
					class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
					style="background-color: white;"
				/>
				<p class="text-red-500 text-sm mt-1" v-if="errors.email">{{ errors.email }}</p>
			</div>

			<!-- Password -->
			<div class="mb-4">
				<label for="password" class="block font-medium mb-1" style="color: var(--color-dark)">Password</label>
				<input
					id="password"
					v-model="password"
					type="password"
					placeholder="******"
					class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
					style="background-color: white;"
				/>
				<p class="text-red-500 text-sm mt-1" v-if="errors.password">{{ errors.password }}</p>
			</div>

			<p class="text-red-500 text-sm mb-4" v-if="error">{{ error }}</p>

			<Button type="submit" :disabled="loading" class="w-full text-white bg-primary">
        {{ loading ? 'Registered in...' : 'Register' }}
      </Button>

      <p class="mt-4 text-center text-sm" style="color: var(--color-dark)">
        Do you have an account?
        <router-link to="/login" class="font-semibold" style="color: var(--color-primary)">
          Login
        </router-link>
      </p>
		</form>
	</AuthLayout>
</template>
  
<script setup lang="ts">
  import { ref } from 'vue'
  import { useField, useForm } from 'vee-validate'
  import { toTypedSchema } from '@vee-validate/zod'
	import { useAuthStore } from '@/store/auth'
  import * as zod from 'zod'
  import AuthLayout from '@/layouts/AuthLayout.vue'
  import { Button } from '@/components/ui/button'
  
  const loading = ref(false)
  const error = ref('')
  const authStore = useAuthStore()
  
  const validationSchema = toTypedSchema(
    zod.object({
      username: zod.string().min(1, 'This is required'),
      email: zod.string().min(1, 'This is required').email('Must be a valid email'),
      password: zod.string().min(8, 'Password must be at least 8 characters'),
    })
  )
  
  const { handleSubmit, errors } = useForm({ validationSchema })
  
  const { value: username } = useField('username')
  const { value: email } = useField('email')
  const { value: password } = useField('password')
  
  const onSubmit = handleSubmit(async (values) => {
    loading.value = true
    error.value = ''
    try {
      
      await authStore.register(values.username, values.email, values.password)
    } catch (e) {
      error.value = 'Something went wrong'
    } finally {
      loading.value = false
    }
  })
</script>
  