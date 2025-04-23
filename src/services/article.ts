import { apiFetch } from './api'
import type { Article } from '@/types/article'
import type { ListResponse, SingleResponse } from '@/types/common'

export async function fetchArticles(
  page = 1,
  pageSize = 5,
  title?: string,
  category?: string
) {
  const params = new URLSearchParams()

  params.append('pagination[page]', page.toString())
  params.append('pagination[pageSize]', pageSize.toString())
  params.append('populate', 'category')

  if (title) {
    params.append('filters[title][$eqi]', title)
  }

  if (category) {
    params.append('filters[category][name][$eqi]', category)
  }

  return apiFetch<ListResponse<Article>>(`/articles?${params.toString()}`)
}


export async function fetchArticleDetail(id: string) {
  return apiFetch<SingleResponse<Article>>(
    `/articles/${id}?populate[comments][populate][user]=*`
  )
}

export async function fetchArticleById(id: string): Promise<{ data: Article } | null> {
  return apiFetch(`/articles/${id}`);
}


export async function createArticle(payload: any) {
  return apiFetch(`/articles`, {
    method: 'POST',
    body: JSON.stringify({ data: payload }),
  })
}

export async function updateArticle(id: string, payload: any) {
  return apiFetch(`/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ data: payload }),
  })
}

export async function deleteArticle(id: string) {
  return apiFetch(`/articles/${id}`, {
    method: 'DELETE',
  })
}

export async function createComent(payload:any) {
  return apiFetch(`/comments`, {
    method: 'POST',
    body: JSON.stringify({ data: payload })
  })
}
