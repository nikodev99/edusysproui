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
            // Warning: A rich, vibrant Orange background with a warm tinted-white text
            return literalColor ? ['#EA580C', '#FFF7ED'] : 'warning';

        case AssignmentTypeLiteral.DEPARTMENT_ASSIGNMENT:
            // Success: A modern Emerald Green background with a cool mint-white text
            return literalColor ? ['#059669', '#ECFDF5'] : 'success';

        case AssignmentTypeLiteral.EXAMINATION_ASSIGNMENT:
            // Processing: A clean Royal Blue background with an icy-white text
            return literalColor ? ['#2563EB', '#EFF6FF'] : 'processing';

        case AssignmentTypeLiteral.SESSION_ASSIGNMENT:
            // Error: A bold Rose/Red background with a soft blush-white text
            return literalColor ? ['#E11D48', '#FFF1F2'] : 'error';

        default:
            // Default: A sleek Slate Gray background with an off-white text
            return literalColor ? ['#4B5563', '#F9FAFB'] : undefined;
    }
}