export enum Day {
    MONDAY = 0,
    TUESDAY = 1,
    WEDNESDAY = 2,
    THURSDAY = 3,
    FRIDAY = 4,
    SATURDAY = 5,
    SUNDAY = 6,
    ALL_DAYS = 7,
}

export const frenchDay = (day: Day) => {
    switch (day) {
        case Day.MONDAY: return 'Lundi'
        case Day.TUESDAY: return 'Mardi'
        case Day.WEDNESDAY: return 'Mercredi'
        case Day.THURSDAY: return 'Jeudi'
        case Day.FRIDAY: return 'Vendredi'
        case Day.SATURDAY: return 'Samedi'
        case Day.SUNDAY: return 'Dimanche'
        default: return null
    }
}