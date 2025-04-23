import { defineStore } from 'pinia'
import type { Article, ArticleForm } from '@/types/article'

import {
  fetchArticles,
  fetchArticleDetail,
  createArticle,
  updateArticle,
  deleteArticle,
} from '@/services/article'

export const useArticleStore = defineStore('article', {
  state: () => ({
    articles: [] as Article[],
    currentPage: 1,
    pageSize: 5,
    loading: false,
    hasMore: true,
    detail: null as Article | null,
    total: 0,
    detailError: null as string | null,
  }),

  actions: {
    async loadMoreArticles(title?: string, category?: string) {
      if (this.loading || !this.hasMore) return
    
      this.loading = true
    
      try {
        const res = await fetchArticles(this.currentPage, this.pageSize, title, category)
    
        this.articles.push(...res.data)
    
        this.total = res.meta.pagination.total
        const totalPage = res.meta.pagination.pageCount
        this.hasMore = this.currentPage < totalPage
    
        this.currentPage++
    
      } catch (err) {
        console.error('Failed to load articles:', err)
      } finally {
        this.loading = false
      }
    },

    async getDetailArticle(id: string) {
      this.loading = true
      this.detailError = null
      try {
        const res = await fetchArticleDetail(id)
        this.detail = res.data
      } catch (err: any) {
        console.error('Failed Get Detail Article:', err)
        this.detailError = err.message || 'Failed Load Detail Article.'
      } finally {
        this.loading = false
      }
    },

    async createArticle(payload: ArticleForm) {
      this.loading = true
      try {
        await createArticle(payload)

        this.articles = []
        this.currentPage = 1
        this.hasMore = true
        await this.loadMoreArticles()


      } catch (err) {
        console.error('Failed Create Article:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateArticle(id: string, payload: ArticleForm) {
      this.loading = true
      try {
        await updateArticle(id, payload)

        this.articles = []
        this.currentPage = 1
        this.hasMore = true
        await this.loadMoreArticles()

      } catch (err) {
        console.error('Failed Update Article:', err)
        throw err
      } finally {
        this.loading = false
      }
    },
    async deleteArticles(id: string) {
      this.loading = true
      try {
        await deleteArticle(id)
    
        this.articles = []
        this.currentPage = 1
        this.hasMore = true
        this.total = 0
    
        await this.loadMoreArticles()
    
      } catch (err) {
        console.error('Failed to delete article:', err)
        throw err
      } finally {
        this.loading = false
      }
    }
  },
})
