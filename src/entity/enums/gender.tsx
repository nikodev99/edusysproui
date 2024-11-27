import {
    PiGenderFemaleBold,
    PiGenderIntersexBold,
    PiGenderMaleBold,
    PiGenderNeuterBold,
    PiGenderNonbinaryBold,
    PiGenderTransgenderBold
} from "react-icons/pi";

export enum Gender {
    HOMME = 'HOMME',
    FEMME = 'FEMME',
    GAY = 'GAY',
    LESBIENNE = 'LESBIENNE',
    NON_BINAIRE = 'NON_BINAIRE',
    FLUIDE = 'FLUIDE',
    QUEER = 'QUEER',
    AGENDER = 'AGENDER',
    BIGENRE = 'BIGENRE',
    PANGENRE = 'PANGENRE',
    TRAVESTI = 'TRAVESTI'
}

export const selectedGenderIcon = (gender?: Gender) => {
    if (gender) {
        switch (gender) {
            case Gender.HOMME: return <PiGenderMaleBold />
            case Gender.FEMME: return <PiGenderFemaleBold />
            case Gender.NON_BINAIRE:
            case Gender.BIGENRE:
                return <PiGenderNonbinaryBold />
            case Gender.AGENDER: return <PiGenderNeuterBold />
            case Gender.GAY:
            case Gender.LESBIENNE:
            case Gender.QUEER:
                return <PiGenderIntersexBold/>
            case Gender.TRAVESTI:
            case Gender.FLUIDE:
            case Gender.PANGENRE:
                return <PiGenderTransgenderBold />
        }
    }
    return null
}
