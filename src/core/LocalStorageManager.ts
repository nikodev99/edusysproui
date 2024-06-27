class LocalStorageManager {
    static save<T>(key: string, value: T) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        }catch(err) {
            console.error("Error saving data to localStorage", err);
        }
    }

    static get<T>(key: string): T | null {
        try {
            const serializedValue = localStorage.getItem(key);
            if (serializedValue === null) {
                return null;
            }
            return JSON.parse(serializedValue) as T;
        }catch(err) {
            console.error("Error retrieving data from localStorage", err);
            return null;
        }
    }

    static update<T>(key: string, updateFunction: (currentValue: T | null) => T) {
        try {
            const currentValue = LocalStorageManager.get<T>(key);
            const updatedValue = updateFunction(currentValue);
            LocalStorageManager.save<T>(key, updatedValue);
        }catch(err) {
            console.error("Error updating data in localStorage", err);
        }
    }

    static remove(key: string) {
        try {
            localStorage.removeItem(key);
        }catch(err) {
            console.error("Error removing data from localStorage", err);
        }
    }

    static clear() {
        try {
            localStorage.clear();
        }catch(err) {
            console.error("Error clearing localStorage", err);
        }
    }
}

export default LocalStorageManager