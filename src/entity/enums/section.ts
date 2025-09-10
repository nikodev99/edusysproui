export enum SectionType {
    MATERNELLE = 'MATERNELLE',
    PRIMAIRE = 'PRIMAIRE',
    COLLEGE = 'COLLEGE',
    LYCEE = 'LYCÉE',
    INSTITUT = 'INSTITUT',
    INSTITUT_TECHNIQUE = 'INSTITUT TECHNIQUE',
    UNIVERSITE = 'UNIVERSITÉ',
    LYCEE_GENERALE = 'LYCÉE GENERALE',
    LYCEE_TECHNIQUE = 'LYCÉE TECHNIQUE',
    LYCEE_TECHNIQUE_COMMERCIALE = 'LYCÉE TECHNIQUE COMMERCIALE',
    LYCEE_TECHNIQUE_INDUSTRIEL = 'LYCÉE TECHNIQUE INDUSTRIEL',
    LYCEE_PROFESSIONNEL = 'LYCÉE PROFESSIONNEL',
    BACHELOR = 'BACHELOR',
    MASTER = 'MASTER',
    DOCTORAT = 'DOCTORAT',
    LICENCE = 'LICENCE',
    ENGINEERING = 'INGÉNIERIE',
    CERTIFICATION = 'CERTIFICATION',
    OTHER = 'AUTRE'
}

export const UNIVERSITY_SECTIONS = new Set<SectionType>([
    SectionType.BACHELOR,
    SectionType.INSTITUT,
    SectionType.INSTITUT_TECHNIQUE,
    SectionType.UNIVERSITE,
    SectionType.MASTER,
    SectionType.DOCTORAT,
    SectionType.LICENCE,
    SectionType.ENGINEERING,
    SectionType.CERTIFICATION,
])

export const COLLEGE_SECTIONS = new Set<SectionType>([
    SectionType.COLLEGE,
    SectionType.LYCEE,
    SectionType.LYCEE_GENERALE,
    SectionType.LYCEE_TECHNIQUE,
    SectionType.LYCEE_TECHNIQUE_COMMERCIALE,
    SectionType.LYCEE_TECHNIQUE_INDUSTRIEL,
    SectionType.LYCEE_PROFESSIONNEL
])

export const anyIsUniversity = (sections: (SectionType | string)[]) =>
    sections.some(isUniversity)

export const isUniversity = (section: SectionType | string) => {
    if (typeof section === 'string') {
        const enumVal = SectionType[section]
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
