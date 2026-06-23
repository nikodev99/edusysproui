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

export type WeekDay = keyof typeof Day

export const frenchDay = (day: Day | WeekDay, isShort: boolean = false) => {
    switch (day) {
        case Day.MONDAY : case "MONDAY": return isShort ? 'Lun.' : 'Lundi'
        case Day.TUESDAY : case "TUESDAY": return isShort ? 'Mar.' : 'Mardi'
        case Day.WEDNESDAY : case "WEDNESDAY": return isShort ? 'Mer.' : 'Mercredi'
        case Day.THURSDAY : case "THURSDAY": return isShort ? 'Jeu.' : 'Jeudi'
        case Day.FRIDAY : case "FRIDAY": return isShort ? 'Ven.' : 'Vendredi'
        case Day.SATURDAY : case "SATURDAY": return isShort ? 'Sam.' : 'Samedi'
        case Day.SUNDAY : case "SUNDAY": return isShort ? 'Dim.' : 'Dimanche'
        default: return null
    }
}