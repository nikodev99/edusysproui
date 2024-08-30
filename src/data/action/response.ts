export interface Response<T> {
    isSuccess: boolean
    isLoading?: boolean
    error?: string
    success?: string
    data?: T[] | T
}