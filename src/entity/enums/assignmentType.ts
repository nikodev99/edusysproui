export enum AssignmentType {
    CLASSROOM_ASSIGNMENT,
    DEPARTMENT_ASSIGNMENT,
    EXAMINATION_ASSIGNMENT,
    SESSION_ASSIGNMENT,
}

export enum AssignmentTypeLiteral {
    CLASSROOM_ASSIGNMENT = 'TSA',
    DEPARTMENT_ASSIGNMENT = 'DEF',
    EXAMINATION_ASSIGNMENT = 'EC',
    SESSION_ASSIGNMENT = 'EF'
}

export const getAssignmentType = (assignmentType: AssignmentType): string | undefined => {
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

export const typeColors = (assignmentType: AssignmentTypeLiteral, literalColor?: boolean) => {
    switch (assignmentType) {
        case AssignmentTypeLiteral.CLASSROOM_ASSIGNMENT:
            return literalColor ? ['#b8860b', '#fff8dc'] : 'warning'
        case AssignmentTypeLiteral.DEPARTMENT_ASSIGNMENT:
            return literalColor ? ['#228b22', '#eaffea'] : 'success'
        case AssignmentTypeLiteral.EXAMINATION_ASSIGNMENT:
            return literalColor ? ['#4682b4', '#e6f2ff'] : 'processing'
        case AssignmentTypeLiteral.SESSION_ASSIGNMENT:
            return literalColor ? ['#8b0000', '#ffeaea'] : 'error'
        default:
            return literalColor ? ['#ccc', '#000'] : undefined
    }
}