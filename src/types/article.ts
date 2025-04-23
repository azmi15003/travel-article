export interface Article {
  id: string | number
  documentId: string
  title: string
  cover_image_url: string
  publishedAt: string
  description: string
  createdAt: string
  updatedAt: string
  category: {
    name?: string
    id: number
  }
}

export interface ArticleForm {
  title: string
  description: string
  cover_image_url: string
  category: number
}