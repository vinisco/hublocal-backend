interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

class PaginationResponse<TData> {
  results: TData[];
  meta: PaginationMeta;
}

export { PaginationMeta, PaginationResponse };
