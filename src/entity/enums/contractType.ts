
export enum ContractTypeEnum {
    CDI= "CDI",
    CDD = "CDD",
    STAGE = "Stage",
    VACATAIRE = "Vacataire",
    PRESTATION = "Contrat de Prestation",
    CTI = "Contrat de travail intermittent (CTI)",
    VIE = "Contrat de Volontariat (VIE)"
}

export type ContractType = keyof typeof ContractTypeEnum