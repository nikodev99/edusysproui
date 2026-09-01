class ObjectHelper<T extends object> {
    isEmpty(obj: T) {
        if (!obj) return true;
        const keys = Object.keys(obj);

        // If it has 0 keys, it is empty
        if (keys.length === 0) return true;

        // If it has more than 1 key, it is not empty
        if (keys.length > 1) return false;

        // If it has exactly 1 key, evaluate the value
        const value = obj[keys[0]];

        // Returns true (meaning it IS empty) if:
        // 1. The value is falsy (null, undefined, 0, false, "")
        // 2. The value is a truthy object/array but has 0 keys itself
        return !value ||
            (typeof value === 'object' && Object.keys(value).length === 0) ||
            (Array.isArray(value) && value.length === 0);
    }

    /**
     * Safely checks if an object has a specific own property.
     * Uses a type predicate to narrow the type after the check.
     *
     * @param obj - The object to inspect
     * @param key - The property key to look for
     * @returns True if the property exists as an own property, false otherwise
     */
    hasProperty<T extends object, K extends string>(
        obj: T,
        key: K
    ): obj is T & Record<K, unknown> {
        return obj !== null &&
            typeof obj === 'object' &&
            Object.prototype.hasOwnProperty.call(obj, key);
    }
}

export const objectHelper = new ObjectHelper()