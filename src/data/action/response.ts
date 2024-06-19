export interface Response<T> {
    isSuccess: boolean
    error?: string
    success?: string
    data?: T[] | T
}