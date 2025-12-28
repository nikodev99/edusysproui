export enum InputTypeEnum {
    TEXT, PASSWORD, NUMBER, SELECT, DATE, COUNTRY, TIME, TEXTAREA, CHECKBOX, RADIO, LIST,
    RANGE
}

export enum AddressOwner {
    STUDENT, TEACHER, EMPLOYEE, GUARDIAN, ENROLLMENT, SCHOOL
}

export enum IndividualType {
    EMPLOYEE, GUARDIAN, TEACHER, STUDENT
}

export enum UpdateType {
    ADDRESS, HEALTH, GUARDIAN, INFO, TEACHER, ASSIGNMENT, EMPLOYEE, SCHOOL,
    ACADEMIC_YEAR, GRADE, DEPARTMENT, USER
}

export enum LinkToStudent {
    PERE = 'Père',
    MERE = 'Mère',
    FRERE = 'Frère',
    SOEUR = 'Soeur',
    ONCLE = 'Oncle',
    TANTE = 'Tante',
    GRAND_PERE = 'Grand Père',
    GRANDE_MERE = 'Grande Mère',
    GRAND_ONCLE = 'Grand Oncle',
    COUSIN = 'Cousin',
    COUSINE = 'Cousine',
    BEAU_PERE = 'Beau Père',
    BELLE_MERE = 'Belle Mère',
    BEAU_FRERE = 'Beau Frère',
    BELLE_SOEUR = 'Belle Soeur',
    OTHER = 'Autre',
}
