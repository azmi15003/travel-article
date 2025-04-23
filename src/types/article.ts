export interface Comment {
  content: string;
  user: {
    username: string;
  };
}

export interface Article {
  id: string | number
  documentId: string
  title: string
  cover_image_url: string
  publishedAt: string
  description: string
  createdAt: string
  updatedAt: string,
  comments: Comment[]
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