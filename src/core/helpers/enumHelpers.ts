export class EnumHelpers {
    has <T>(actualEnum: T[], current?: T) {
        if (!current)
            return false
        return actualEnum.includes(current)
    }

    hasMultiple <T>(actualEnum: T[], current?: T[] | null) {
        if (!current || current.length === 0)
            return false
        return current.some(c => actualEnum.includes(c))
    }

    createChecker <T>(current: T, ...actualEnum: T[]) {
        return this.has(actualEnum, current)
    }

    createMultipleChecker <T>(current: T[] | null, ...actualEnum: T[]) {
        return this.hasMultiple(actualEnum, current)
    }
}

export const enumHelper = new EnumHelpers()