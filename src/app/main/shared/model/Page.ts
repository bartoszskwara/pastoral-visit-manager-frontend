export class Page<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean,
      unsorted: boolean
    },
    offset: number,
    pageNumber: number,
    pageSize: number,
    unpaged: boolean,
    paged: boolean
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  number: number;
}
