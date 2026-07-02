export enum PunishmentStatus {
    PENDING = "En Attente",
    IN_PROGRESS = "En Cours",
    COMPLETED = "Purgé",
    CANCELLED = 'Annulé',
    DEFERRED = 'En Différé',
    APPEALED = "En Appel"
}

export type PunishStatus = keyof typeof PunishmentStatus

export const filtersStatus = ["ALL", ...Object.keys(PunishmentStatus)];

export const punishmentStatusTag = (status: PunishmentStatus): [string, PunishmentStatus] =>{
    let tagColor: string
    const tagText = PunishmentStatus[status as unknown as keyof typeof PunishmentStatus]
    switch (status) {
    case 'PENDING' as PunishmentStatus:
    case 'DEFERRED' as PunishmentStatus:
    case 'IN_PROGRESS' as PunishmentStatus:
        tagColor = 'warning'
        break;
    case 'COMPLETED' as PunishmentStatus:
        tagColor = 'blue'
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

export const statusTagStyle = (status: PunishStatus) => {
    switch (status) {
        case "PENDING":
        case "DEFERRED":
        case "IN_PROGRESS":
            return { bg: "#fffbe6", border: "#ffe58f", text: "#d48806", dot: "#faad14" };
        case "COMPLETED":
            return { bg: "#e6f4ff", border: "#91caff", text: "#0958d9", dot: "#1677ff" };
        case "CANCELLED":
        case "APPEALED":
            return { bg: "#f9f0ff", border: "#d3adf7", text: "#722ed1", dot: "#722ed1" };
        default:
            return { bg: "#fafafa", border: "#d9d9d9", text: "rgba(0,0,0,0.88)", dot: "#bfbfbf" };
    }
};