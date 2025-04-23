<template>
  <div class="min-h-screen">
    <div class="bg-gradient-to-b from-blue-600 to-blue-300 pb-20">
      <div class="text-center py-16 text-white px-4">
        <h1 class="text-4xl font-bold mb-4">Explore Beyond Boundaries, Travel Beyond Expectations</h1>
        <p class="text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
          we don’t just plan trips, we craft unforgettable adventures.
        </p>
      </div>

      <div class="bg-white mx-auto mt-4 rounded-2xl shadow-lg max-w-5xl px-4 sm:px-6 py-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
          <Input
            class="border-gray-300"
            v-model="title"
            type="text"
            placeholder="Title"
          />
          <Select v-model="selectedCategory">
            <SelectTrigger class="w-full bg-white text-gray-700 border border-gray-300 rounded-md">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent class="bg-white shadow-lg rounded-md">
              <SelectGroup>
                <SelectLabel class="text-gray-500">Categories</SelectLabel>
                <SelectItem :value="null">Semua Kategori</SelectItem>
                <SelectItem v-for="category in categories" :key="category.id" :value="category.name">
                  {{ category.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button type="submit" :disabled="loading" class="w-full text-white cursor-pointer" @click="handleSearch">
            Search
          </Button>
          <Button type="submit" :disabled="loading" class="w-full text-white cursor-pointer" @click="openAddDialog">
            Add Travel Article
          </Button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto mt-8">
      <div
        v-for="n in 4" :key="n"
        class="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div class="h-48 bg-gray-200"></div>
        <div class="p-4 pb-20">
          <div class="h-4 bg-gray-200 mb-2"></div>
          <div class="h-4 bg-gray-200 mb-4"></div>
          <div class="w-1/3 h-2 bg-gray-200 mb-2"></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto mt-8">
      <div
        v-for="article in articles"
        :key="article.id"
        class="bg-white rounded-xl shadow-md overflow-hidden transition relative"
      >
        <div v-if="loading" class="animate-pulse">
          <div
            v-for="n in 4" :key="n"
            class="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div class="h-48 bg-gray-200"></div>
            <div class="p-4 pb-20">
              <div class="h-4 bg-gray-200 mb-2"></div>
              <div class="h-4 bg-gray-200 mb-4"></div>
              <div class="w-1/3 h-2 bg-gray-200 mb-2"></div>
            </div>
          </div>
        </div>
        
        <div v-else>
          <router-link :to="`/articles/${article.documentId}`" class="block">
            <img
              :src="article.cover_image_url"
              alt="Cover image"
              class="w-full h-48 object-cover"
            />
            <div class="p-4 pb-20">
              <p class="text-sm text-gray-500 mb-1">
                {{ formatDate(article.publishedAt) }}
              </p>
              <p class="text-lg text-black font-semibold">{{ article.title }}</p>
              <p class="text-[#757575] text-base mb-2">
                {{ article.description?.slice(0, 100) || '-' }}
              </p>
              <span class="inline-block text-xs mt-2 px-2 py-1 bg-[var(--color-primary)] text-white rounded">
                {{ article.category?.name || '-' }}
              </span>
            </div>
          </router-link>

          <!-- Tombol Edit dan Delete berada di luar router-link -->
          <div class="absolute bottom-4 right-4 flex flex-col sm:flex-row gap-2 z-10">
            <Button
              class="bg-yellow-400 hover:bg-yellow-500 text-white text-xs px-3 py-1 rounded shadow"
              @click.prevent="openEditDialog(article)"
            >
              ✏️ Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="outline" class="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded shadow">
                  🗑 Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent class="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure to Delete this article?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction @click="handleDelete(article.documentId)" class="bg-red-500 text-white">Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>

    <div ref="scrollTrigger" class="mt-10 h-10 flex justify-center items-center text-sm text-gray-600 px-4">
      <svg v-if="loading" class="mr-3 size-5 animate-spin" viewBox="0 0 24 24"></svg>
    </div>
    <Dialog v-model:open="isOpenDialog">
      <DialogContent class="sm:max-w-[500px] bg-white rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle>
            {{ selectedArticle ? 'Edit Travel Article' : 'Add Travel Article' }}
          </DialogTitle>
          <DialogDescription>
            {{ selectedArticle ? 'Ubah artikel yang sudah ada.' : 'Tambahkan artikel baru ke daftar kamu.' }}
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-start gap-4">
            <Label for="title" class="text-right mt-3">Title</Label>
            <div class="col-span-3">
              <Input
                id="title"
                v-model="selectedArticleModel.title"
                @input="clearError('title')"
                placeholder="Masukkan judul artikel"
                class="w-full"
              />
              <p v-if="formErrors.title" class="text-sm text-red-500 mt-1">
                {{ formErrors.title }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-4 items-start gap-4">
            <Label for="description" class="text-right mt-3">Description</Label>
            <div class="col-span-3">
              <Input
                id="description"
                v-model="selectedArticleModel.description"
                @input="clearError('description')"
                placeholder="Deskripsi singkat artikel"
                class="w-full"
              />
              <p v-if="formErrors.description" class="text-sm text-red-500 mt-1">
                {{ formErrors.description }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-4 items-start gap-4">
            <Label for="cover_image_url" class="text-right mt-3">Image</Label>
            <div class="col-span-3">
              <Input
                id="cover_image_url"
                v-model="selectedArticleModel.cover_image_url"
                placeholder="https://example.com/image.jpg"
                @input="clearError('cover_image_url')"
                class="w-full"
              />
              <p v-if="formErrors.cover_image_url" class="text-sm text-red-500 mt-1">
                {{ formErrors.cover_image_url }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-4 items-start gap-4">
            <Label for="category" class="text-right mt-3">Category</Label>
            <div class="col-span-3">
              <Select v-model="selectedArticleModel.category" @update:modelValue="clearError('category')">
                <SelectTrigger class="w-full bg-white text-gray-700 border border-gray-300 rounded-md">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent class="bg-white shadow-lg rounded-md">
                  <SelectGroup>
                    <SelectLabel class="text-gray-500">Categories</SelectLabel>
                    <SelectItem
                      v-for="category in categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p v-if="formErrors.category" class="text-sm text-red-500 mt-1">
                {{ formErrors.category }}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" class="text-white" @click="handleSubmit">
            {{ selectedArticle ? 'Simpan Perubahan' : 'Tambah Artikel' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from 'vue';
import { onMounted, ref } from 'vue'
import { useArticleStore } from '@/store/article'
import { storeToRefs } from 'pinia'
import { getCategories } from '@/services/category'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { Category } from '@/types/categories'
import type { Article, ArticleForm } from '@/types/article'
import * as zod from 'zod';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const articleStore = useArticleStore()
const { articles, loading, hasMore } = storeToRefs(articleStore)

const categories: Ref<Category[] | null> = ref(null);

const title = ref<string>('')
const isOpenDialog = ref<boolean>(false)
const selectedArticle = ref<Article | null>(null)
const scrollTrigger = ref<HTMLElement | null>(null)
const formErrors = ref<Record<string, string>>({})
const selectedCategory = ref<string | null>(null)


const selectedArticleModel = ref({
  title: '',
  description: '',
  cover_image_url: '',
  category: 0
})

const articleSchema = zod.object({
  title: zod.string().min(1, 'Judul wajib diisi'),
  description: zod.string().min(1, 'Deskripsi wajib diisi'),
  cover_image_url: zod.string().url('URL gambar tidak valid'),
  category: zod.number().min(1, 'Pilih kategori'),
})

function clearError(field: keyof typeof selectedArticleModel.value) {
  formErrors.value[field] = ''
}

async function handleSearch() {
  articleStore.$patch({
    articles: [],
    currentPage: 1,
    hasMore: true,
  })
  
  await articleStore.loadMoreArticles(title.value, selectedCategory.value ?? undefined)
}
function openAddDialog() {
  selectedArticle.value = null
  selectedArticleModel.value = {
    title: '',
    description: '',
    cover_image_url: '',
    category: 0
  }
  formErrors.value = {}
  isOpenDialog.value = true
}

function openEditDialog(article: Article) {
  selectedArticle.value = article
  selectedArticleModel.value = {
    title: article.title ?? '',
    description: article.description ?? '',
    cover_image_url: article.cover_image_url ?? '',
    category: article.category?.id ?? 0,
  }

  formErrors.value = {}
  isOpenDialog.value = true
}

async function handleSubmit() {
  formErrors.value = {}

  const result = articleSchema.safeParse(selectedArticleModel.value)

  if (!result.success) {
    result.error.errors.forEach((err) => {
      const field = err.path[0]
      formErrors.value[field] = err.message
    })
    return
  }

  const payload = result.data as ArticleForm

  try {
    if (selectedArticle.value) {
      await articleStore.updateArticle(selectedArticle.value.documentId, payload)
    } else {
      await articleStore.createArticle(payload)
    }
    isOpenDialog.value = false
  } catch (err) {
    console.error('Failed Submit:', err)
  }
}
async function handleDelete(id: string) {
  await articleStore.deleteArticles(id)
}

onMounted(async () => {
  if (articles.value.length === 0) {
    await articleStore.loadMoreArticles()
  }
  const res = await getCategories()
  categories.value = res.data

  const observer = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loading.value) {
        await articleStore.loadMoreArticles()
      }
    },
    { rootMargin: '100px' }
  )

  if (scrollTrigger.value) {
    observer.observe(scrollTrigger.value)
  }
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>
