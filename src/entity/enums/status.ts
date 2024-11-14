export enum Status {
    MARIE = 'MARRIED',
    CELIBATAIRE = 'SINGLE',
    VEUVE = 'WIDOW',
    VEUF = 'WIDOWER',
    DIVORCE = 'DIVORCED',
    SEPARE = 'SEPARATED',
    PACSE = 'PARTNERSHIP',
    CONCUBIN = 'CONCUBIN'
}

export function getStatusKey(value: Status, female?: boolean): keyof typeof Status | undefined {
    for (let key in Status) {
        if (Status[key as keyof typeof Status] === value) {
            if (female) {
                if (
                    value === Status.MARIE ||
                    value === Status.DIVORCE ||
                    value === Status.SEPARE ||
                    value === Status.CONCUBIN
                ) {
                    key = key + 'E'
                }
            }
            return key as keyof typeof Status;
        }
    }
    return undefined; // Return undefined if the value is not found
}