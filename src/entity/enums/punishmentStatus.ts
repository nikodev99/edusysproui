export enum PunishmentStatus {
    PENDING = "En Attente",
    IN_PROGRESS = "En Cours",
    COMPLETED = "Purgé",
    CANCELLED = 'Annulé',
    DEFERRED = 'En Différé',
    APPEALED = "En Appel"
}

export const punishmentStatusTag = (status: PunishmentStatus): [string, PunishmentStatus] =>{
    let tagColor
    const tagText = PunishmentStatus[status as unknown as keyof typeof PunishmentStatus]
    switch (status) {
    case 'PENDING' as PunishmentStatus:
    case 'DEFERRED' as PunishmentStatus:
        tagColor = 'warning'
        break;
    case 'IN_PROGRESS' as PunishmentStatus:
    case 'COMPLETED' as PunishmentStatus:
        tagColor = 'success'
        break;
    case 'CANCELLED' as PunishmentStatus:
    case 'APPEALED' as PunishmentStatus:
        tagColor = 'processing'
        break;
    default:
        tagColor = 'gray';
    }
    return [tagColor, tagText];
}