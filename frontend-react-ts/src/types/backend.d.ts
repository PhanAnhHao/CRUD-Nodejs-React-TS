export interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    status?: number;
    data?: T;
    pagination?: IPagination;
}

export interface IPagination {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}
