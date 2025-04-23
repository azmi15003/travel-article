<template>
  <div class="min-h-screen p-6">
    <div class="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <div v-if="loading" class="h-48 bg-gray-200"></div>
        <img
          v-else
          :src="article?.cover_image_url"
          alt="Article Image"
          class="w-full h-auto rounded-lg object-cover"
        />
        <div v-if="loading">
          <div class="p-4 pb-20">
          <div class="h-4 bg-gray-200 mb-2"></div>
          <div class="h-4 bg-gray-200 mb-4"></div>
          <div class="w-1/3 h-2 bg-gray-200 mb-2"></div>
        </div>
        </div>
        <div v-else class="p-5 bg-gray-50">
          <h2 class="text-2xl font-bold mb-4">{{ article?.title }}</h2>
          <p class="text-gray-700 mb-4">{{ article?.description }}</p>
          <p class="text-sm text-gray-600 mb-2">
            <strong>Operating Hours:</strong> Everyday 10.00am to 7.00pm
          </p>
          <p class="text-sm text-gray-600 mb-2">
            <strong>Address:</strong> Indonesia
          </p>
          <p class="text-sm text-gray-600">
            <strong>Published at:</strong> {{ formatDate(article?.publishedAt ?? "-") }}
          </p>
        </div>
      </div>

      <div class="p-6">
        <h3 class="text-xl font-semibold mb-4 text-center">{{ article?.title }} Reviews</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div
            v-for="(review, idx) in article?.comments"
            :key="idx"
            class="bg-gray-50 p-4 rounded-lg shadow"
          >
            <div class="font-semibold mb-2">{{ review.user?.username }}</div>
            <p class="text-sm text-gray-700">{{ review?.content }}</p>
          </div>
        </div>

        <div class="mt-6 pt-4">
          <form @submit.prevent="submitReview" class="space-y-4">
            <div class="grid w-full gap-1.5">
              <Label for="message-2">Leave a Review</Label>
              <Textarea v-model="newReview.content" id="message-2" placeholder="Type your message here." />
              <p class="text-sm text-muted-foreground">
                Your message will be copied to the support team.
              </p>
            </div>
            <Button
              type="submit"
              class="bg-primary text-white"
            >
              {{ submitting ? 'Submitting...' : 'Submit Review' }}
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '@/store/article'
import { createComent } from '@/services/article'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { Article } from '@/types/article'

const route = useRoute()
const articleStore = useArticleStore()

const idParam = route.params.id
const id = typeof idParam === 'string' ? idParam : idParam?.[0]

const article = computed<Article | null>(() => articleStore.detail)
const loading = computed(() => articleStore.loading)

const newReview = ref<{ username: string; content: string }>({
  username: '',
  content: ''
})
const submitting = ref(false)

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  if (id) {
    articleStore.getDetailArticle(id)
  }
})

const submitReview = async () => {
  if (!id || submitting.value) return

  try {
    submitting.value = true

    const payload = {
      article: article.value?.id,
      content: newReview.value.content
    }

    await createComent(payload)
    await articleStore.getDetailArticle(id)

    newReview.value.username = ''
    newReview.value.content = ''
  } catch (err) {
    console.error('Failed to submit comment:', err)
    alert('Failed to submit comment. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.text-primary {
  color: var(--color-primary);
}

.prose :deep(img) {
  border-radius: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
