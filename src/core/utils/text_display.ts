import {loggedUser} from "@/auth/jwt/LoggedUser.ts";
import {toLower} from "./utils.ts";

export const raw = {
    home: {
        label: 'Tableau de bord',
        href: '/dashboard',
        path: {
            page: ['/', 'dashboard'],
        },
    },
    search: {
        label: 'Recherche',
        href: '/search'
    },
    student: {
        label: 'Étudiants',
        href: '/students',
        group: {
            add: {
                label: 'Inscription',
                href: '/students/new'
            },
            reAdd: {
              label: 'Réinscription',
              href: '/students/re-enrollment'
            },
            view: {
                label: 'Details',
                href: '/students/'
            }
        }
    },
    teacher: {
        label: 'Enseignants',
        href: '/teachers',
        group: {
            view: {
                label: 'Voir',
                href: '/teachers/'
            },
            add: {
                label: 'Nouveau enseignant',
                href: '/teachers/new'
            }
        }
    },
    guardian: {
        label: 'Tuteurs',
        href: '/guardians',
        group: {
            view: {
                label: 'Voir',
                href: '/guardians/'
            },
            add: {
                label: 'Ajouter Tuteur',
                href: '/guardians/new'
            }
        }
    },
    cc: {
        label: 'Classes & Matières',
        href: '/classes-and-subjects',
        group: {
            classe: {
                path: {
                    view: 'classe/:id'
                },
                add: {
                    label: 'Nouvelle Classe',
                    href: '/classes-and-subjects/classe/new'
                },
                view: {
                    label: 'Afficher',
                    href: '/classes-and-subjects/classe/'
                },
            },
            course: {
                path: {
                    view: 'subject/:id'
                },
                view: {
                    label: 'afficher la Matière',
                    href: '/classes-and-subjects/subject/'
                },
                add: {
                    label: 'Nouvelle Matière',
                    href: '/classes-and-subjects/subject/new'
                }
            },

        }
    },
    exam: {
        label: 'Evaluations',
        href: '/examinations',
        group: {
            add: {
                label: 'Créer Devoir',
                href: '/examinations/new'
            },
            view: {
                label: 'Détails',
                href: '/examinations/'
            }
        }
    },
    att: {
        label: 'Presence',
        href: '/attendances',
        group: {
            add: {
                label: 'Ajouter la fiche de présence',
                href: '/attendances/new'
            },
            edit: {
                label: 'Mise à jour',
                href: '/attendances/update'
            },
            view: {
                label: 'Voir la fiche de présence du jour',
                href: '/attendances/'
            }
        }
    },
    library: {
        label: 'Bibliothèque',
        href: '/library',
        group: {
            add: {
                label: 'Ajouter un livre',
                href: '/library/new'
            },
            view: {
                label: 'Voir les livres',
                href: '/library/'
            }
        }
    },
    finance: {
        label: 'Finance',
        href: '/fee-and-finance',
    },
    chat: {
        label: 'Communication',
        href: '/chat',
    },
    employee: {
        label: 'Resource Humaine',
        href: '/staff-management',
        group: {
            add: {
                label: 'Ajouter Employé',
                href: '/staff-management/new'
            },
            view: {
                label: 'Afficher Employé',
                href: '/staff-management/'
            }
        }
    },
    org: {
        label: 'Organisation',
        href: '/organization',
        group: {
            school: {
                label: 'Organisation',
                href: '/organization/school'
            },
            academicYear: {
                label: 'Années Académiques',
                href: '/organization/academic_year'
            },
            grade: {
                label: 'Grades',
                href: '/organization/grades',
                add: {
                    label: 'Ajouter un grade',
                    href: '/organization/grades/new'
                },
                edit: {
                    label: 'Modifier Grade',
                    href: '/organization/grades/'
                }
            },
            department: {
                label: 'Départements',
                href: '/organization/departments',
                add: {
                    label: 'Ajouter Département',
                    href: '/organization/departments/new'
                },
                view: {
                    label: 'Afficher Département',
                    href: '/organization/departments/'
                }
            },
            user: {
                label: 'Utilisateurs',
                href: '/organization/users',
                add: {
                    label: 'Ajouter Utilisateurs',
                    href: '/organization/users/new'
                },
                view: {
                    label: 'Afficher Utilisateurs',
                    href: '/organization/users/'
                }
            },
        }
    },
    settings: {
        label: 'Paramètres',
        href: '/settings',
        group: {
            customize: {
                label: 'Customiser',
                href: '/settings/customize'
            },
        }
    },
    path: {
        page: '',
        edit: 'update',
        new: 'new',
        view: ':id',
        slug: ':slug',
        both: ':id/:slug'
    },
    schoolID: '81148a1b-bdb9-4be1-9efd-fdf4106341d6',
    http: 'http://localhost:5173',
    academicYear: {
        name: 'Année scolaire'
    },
    semester: 'Trimestre'
}

/**
 * Processes a deep clone of the `text` object and appends a given school slug as a prefix
 * to all `href` properties found in the object hierarchy.
 *
 * @param {string} schoolSlug - The slug to be prefixed to all `href` properties.
 * @returns {typeof text} A deep clone of the `text` object with modified `href` properties.
 */
export const withSlug = (schoolSlug: string): typeof raw => {
    const prefix = `/${schoolSlug}`
    const deepClone = JSON.parse(JSON.stringify(raw))
    const walk = (obj: Record<string, unknown>) => {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object') {
                walk(obj[key] as Record<string, unknown>)
            }else if (key === 'href') {
                obj[key] = prefix + obj[key]
            }
        })
    }
    walk(deepClone)
    return deepClone as typeof raw
}

export const calendarMessages = {
    allDay: 'Journée entière',
    previous: 'Précédent',
    next: 'Suivant',
    today: 'Aujourd\'hui',
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Heure',
    event: 'Événement',
    showMore: (total: unknown) => `+ Voir ${total} autres`,
};

export const jwt = {
    tokenKey: '@jwtAccessToken',
    refreshTokenKey: '@jwtRefreshToken',
    user: '@edusyspro-user',
    school: '@edusyspro-school',
    roles: '@edusyspro-roles',
}

export const text = withSlug(toLower(loggedUser.getSchool()?.abbr as string) as string)