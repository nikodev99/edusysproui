import {loggedUser} from "@/auth/jwt/LoggedUser.ts";
import {setFirstName, toLower} from "./utils.ts";
import {SettingsAccessor} from "@/entity";
import {useSetting} from "@/core/store/settingAccessor.ts";

export const rawNav = (config?: SettingsAccessor): NavConfig => {
    return {
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
            label: config?.studentnames as string || 'Étudiants',
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
            label: 'Enseignant',
                href: '/teachers',
                group: {
                view: {
                    label: 'Voir',
                        href: '/teachers/'
                },
                add: {
                    label: 'Ajouter enseignant',
                        affiliate_href: '/teachers/new/affiliate',
                        href: '/teachers/new'
                },
                affiliate: {
                    label: 'Affilier un enseignant',
                        href: '/teachers/affiliate'
                }
            }
        },
        guardian: {
            label: 'Tuteur',
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
        },
        legal: {
            label: 'Legal',
                href: '/legal',
                group: {
                certificates: {
                    href: '/legal/certificates',
                        label: "Certificat Légal",
                },
                term: {href: '/legal/general_term', label: "Terme Général"},
                document: {href: '/legal/special_document', label: "Document Spéciale & Contrat"}
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
}

export const withSlug = (schoolSlug: string, config?: SettingsAccessor) => {
    const prefix = `/${schoolSlug}`
    const raw = rawNav(config)
    const deepClone = JSON.parse(JSON.stringify(raw))
    const walk = (obj: Record<string, unknown>) => {
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object') {
                walk(obj[key] as Record<string, unknown>)
            }else if (key.includes('href')) {
                obj[key] = prefix + obj[key]
            }else if (key.includes('label')) {
                obj[key] = setFirstName(obj[key] as string)
            }
        })
    }
    walk(deepClone)
    return deepClone as typeof raw
}

export const useWithSlug = (schoolSlug: string): NavConfig => {
    const config = useSetting()
    return withSlug(schoolSlug, config)
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

export const useText = () => useWithSlug(toLower(loggedUser.getSchool()?.abbr as string) as string)
export const text = withSlug(toLower(loggedUser.getSchool()?.abbr as string) as string)

interface Link {
    label: string;
    href: string;
}

export interface NavConfig {
    home: Link & {
        path: { page: string[] };
    };

    search: Link;

    student: Link & {
        group: {
            add: Link;
            reAdd: Link;
            view: Link;
        };
    };

    teacher: Link & {
        group: {
            view: Link;
            add: Link & { affiliate_href: string };
            affiliate: Link;
        };
    };

    guardian: Link & {
        group: {
            view: Link;
            add: Link;
        };
    };

    cc: Link & {
        group: {
            classe: {
                path: { view: string };
                add: Link;
                view: Link;
            };
            course: {
                path: { view: string };
                view: Link;
                add: Link;
            };
        };
    };

    exam: Link & {
        group: {
            add: Link;
            view: Link;
        };
    };

    att: Link & {
        group: {
            add: Link;
            edit: Link;
            view: Link;
        };
    };

    library: Link & {
        group: {
            add: Link;
            view: Link;
        };
    };

    finance: Link;
    chat: Link;

    employee: Link & {
        group: {
            add: Link;
            view: Link;
        };
    };

    org: Link & {
        group: {
            school: Link;
            academicYear: Link;
            grade: Link & { add: Link; edit: Link };
            department: Link & { add: Link; view: Link };
            user: Link & { add: Link; view: Link };
        };
    };

    settings: Link;

    legal: Link & {
        group: {
            certificates: Link;
            term: Link;
            document: Link;
        };
    };

    path: {
        page: string;
        edit: string;
        new: string;
        view: string;
        slug: string;
        both: string;
    };

    schoolID: string;
    http: string;
    academicYear: { name: string };
    semester: string;
}