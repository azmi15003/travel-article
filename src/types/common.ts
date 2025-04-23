export interface PaginationMeta {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
  
export interface ListResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface SingleResponse<T> {
  data: T
  meta?: any
}