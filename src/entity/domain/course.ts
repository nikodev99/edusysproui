import {Department} from "@/entity";

export interface Course {
    id?: number
    course?: string
    abbr?: string
    courseType: CourseType
    discipline?: string
    department?: Department
    createdAt?: Date
    modifyAt?: Date
}

export type CourseType = keyof CourseTypeEnum

export enum CourseTypeEnum {
    // 0. Math, Physics, Biology, etc.
    SCIENCES = 'Sciences Exact',

    // 1. French, English, Spanish, local languages, etc.
    LANGUAGES = 'Langues & Lettres',

    // 2. History, Geography, Philosophy, Civics
    HUMANITIES = 'Sciences Humaines & Sociales',

    // 3. Arts, Music, Drama
    ART = 'Arts & Culture',

    // 4. Sports, Fitness, Yoga, Dance
    SPORT = 'Sports & Éducation Physique',

    // 5. Economics, Accounting, Law
    ECONOMICS = 'Économie & Gestion',

    // 6. Mechanics, Electricity, Vocational tracks
    TECHNICAL = 'Sciences Techniques & Métiers',

    // 7. Coding, Software, Data, Cyber
    COMPUTER_SCIENCE = 'Informatique & Numérique',

    // 8. Leadership, Public speaking, Soft skills
    SOFT_SKILLS = 'Développement Personnel',

    // 9. First aid, Nutrition, Health studies
    HEALTH = 'Santé & Secourisme',

    // 10. General support, Exam prep, Transversal skills
    GENERAL = 'Methodology'
}