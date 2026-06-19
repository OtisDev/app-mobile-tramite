export interface Response<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface NullableResponse<T> {
    success: boolean;
    message: string;
    data?: T | null;
}

export interface PaginatedResponse<T> extends Response<T[]> {
    meta: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
}

export interface PaginatedRequest {
    per_page?: number;
    page?: number;
    result_type?: 'collection' | 'list' | 'paginated';
}