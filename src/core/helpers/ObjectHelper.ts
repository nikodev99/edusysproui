class ObjectHelper<T extends object> {
    isEmpty(obj: T) {
        return Object.keys(obj).length === 0;
    }
}

export const objectHelper = new ObjectHelper()