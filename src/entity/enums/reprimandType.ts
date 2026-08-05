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
        // Severe — red family
        case ReprimandType.VIOLENCE:
            return "#991b1b";
        case ReprimandType.BULLYING:
            return "#b91c1c";
        case ReprimandType.VANDALISM:
            return "#dc2626";

        // Serious — orange family
        case ReprimandType.CHEATING:
            return "#c2410c";
        case ReprimandType.FRAUD:
            return "#ea580c";
        case ReprimandType.INSUBORDINATION:
            return "#9a3412";
        case ReprimandType.SUBSTANCE:
            return "#b45309";

        // Minor/procedural — amber/brown family
        case ReprimandType.TRUANCY:
            return "#a16207";
        case ReprimandType.NONCOMPLIANCE:
            return "#854d0e";
        case ReprimandType.DISRESPECT:
            return "#92400e";

        default:
            return "#1d4ed8";
    }
};