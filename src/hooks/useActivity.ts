import {useUserRepo} from "./actions/useUserRepo.ts";
import {Individual} from "../entity";
import {text} from "../core/utils/text_display.ts";

export const useActivity = () => {
    const {saveActivity} = useUserRepo()

    const enrollStudentActivity = (ind: Individual, classe: string) => saveActivity({
        action: "Inscription d'un nouvel " + (text.student.label).toLowerCase(),
        description: `Inscription de ${ind?.lastName} ${ind?.lastName} à la classe de ${classe}`,
    })

    const reenrollStudentActivity = (ind: Individual, classe: string) => saveActivity({
        action: 'Réinscription d\'un ancien ' + (text.student.label).toLowerCase(),
        description: `Réinscription de ${ind?.lastName} ${ind?.lastName} à la classe de ${classe}`,
    })

    const promoteStudentActivity = (ind: Individual, exClasse: string, classe: string) => saveActivity({
        action: text.student.label + ' promu à une classe superieur',
        description: `Promotion de ${ind?.lastName} ${ind?.lastName} à une classe superieur: ${exClasse} --> ${classe} `,
    })

    return {
        enrollStudentActivity,
        reenrollStudentActivity,
        promoteStudentActivity
    }
}