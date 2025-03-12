export enum AssignmentType {
    CLASSROOM_ASSIGNMENT,
    DEPARTMENT_ASSIGNMENT,
    EXAMINATION_ASSIGNMENT,
    SESSION_ASSIGNMENT,
}

export const getAssignmentType = (assignmentType: AssignmentType) => {
    switch (assignmentType) {
        case AssignmentType.CLASSROOM_ASSIGNMENT:
            return 'Travaux de suivi et d’apprentissage'
        case AssignmentType.DEPARTMENT_ASSIGNMENT:
            return 'Évaluation formative'
        case AssignmentType.EXAMINATION_ASSIGNMENT:
            return 'Évaluation certificative'
        case AssignmentType.SESSION_ASSIGNMENT:
            return 'Examen Final'
        default:
            return undefined
    }
}