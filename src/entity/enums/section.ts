export enum SectionType {
    GARDERIE = 'GARDERIE',
    CRECHE = 'CRECHE',
    MATERNELLE = 'MATERNELLE',
    PRIMAIRE = 'PRIMAIRE',
    COLLEGE = 'COLLEGE',
    LYCEE = 'LYCÉE',
    BTS = 'CYCLE BTS',
    DUT = "CYCLE DUT",
    LICENCE = 'CYCLE LICENCE',
    MASTER = 'CYCLE MASTER',
    DOCTORAT = 'CYCLE DOCTORAT',
    PROFESSIONAL = "FORMATION PROFESSIONNELLE",
    ENGINEERING = 'CYCLE INGÉNIERIE',
    CERTIFICATION = 'CERTIFICATION',
    OTHER = 'AUTRE'
}

export const UNIVERSITY_SECTIONS = new Set<SectionType>([
    SectionType.BTS,
    SectionType.DUT,
    SectionType.PROFESSIONAL,
    SectionType.MASTER,
    SectionType.DOCTORAT,
    SectionType.LICENCE,
    SectionType.ENGINEERING,
    SectionType.CERTIFICATION,
])

export const COLLEGE_SECTIONS = new Set<SectionType>([
    SectionType.COLLEGE,
    SectionType.LYCEE,
])

export const anyIsUniversity = (sections: (SectionType | string)[]) =>
    sections.some(isUniversity)

export const isUniversity = (section: SectionType | string) => {
    console.log('section: ', section)
    if (typeof section === 'string') {
        const enumVal = SectionType[section]
        console.log('enumVal: ', enumVal)
        if(enumVal === undefined || enumVal === null) return false
        return UNIVERSITY_SECTIONS.has(enumVal)
    }
    return UNIVERSITY_SECTIONS.has(section)
}

export const anyIsCollege = (sections: (SectionType | string)[]) =>
    sections.some(isCollege)

export const isCollege = (section: SectionType | string) => {
    if (typeof section === 'string') {
        const enumVal = SectionType[section]
        if(enumVal === undefined || enumVal === null) return false
        return COLLEGE_SECTIONS.has(enumVal)
    }
    return COLLEGE_SECTIONS.has(section)
}
