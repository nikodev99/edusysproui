export enum ReprimandType {
    INSUBORDINATION = 'INSUBORDINATION',
    TRUANCY = 'TRUANDISME',
    CHEATING = 'TRICHERIE',
    DISRESPECT = 'IRRESPECT',
    VANDALISM = 'VANDALISME',
    VIOLENCE = 'VIOLENCE',
    BULLYING = 'INTIMIDATION',
    SUBSTANCE = 'SUBSTANCE',
    FRAUD = 'FRAUDE',
    NONCOMPLIANCE = 'NON-CONFORMITÉ',
}

export const typeColor = (t: ReprimandType) => {
    switch (t) {
        case ReprimandType.CHEATING:
        case ReprimandType.FRAUD:
        case ReprimandType.INSUBORDINATION:
        case ReprimandType.SUBSTANCE:
            return "#FF7A45";
        case ReprimandType.VIOLENCE:
        case ReprimandType.BULLYING:
        case ReprimandType.VANDALISM:
            return "#F5222D";
        case ReprimandType.TRUANCY:
        case ReprimandType.NONCOMPLIANCE:
        case ReprimandType.DISRESPECT:
            return "#FAAD14";
        default:
            return "blue";
    }
};