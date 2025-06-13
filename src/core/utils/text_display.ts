export const text = {
    home: {
        label: 'Tableau de bord',
        href: '/dashboard',
        path: {
            page: ['/', 'dashboard'],
        },
    },
    student: {
        label: 'Étudiant',
        href: '/students',
        group: {
            add: {
                label: 'Inscription',
                href: '/students/new'
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
                label: 'Nouveau enseignant',
                href: '/teachers/new'
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
                label: 'Fiche de présence du jour',
                href: '/attendances/new'
            },
            view: {
                label: 'Voir la fiche de présence du jour',
                href: '/attendances/'
            }
        }
    },
    path: {
        page: '',
        new: 'new',
        view: ':id',
    },
    schoolID: '81148a1b-bdb9-4be1-9efd-fdf4106341d6',
    http: 'http://localhost:5173',
    academicYear: {
        name: 'Année scolaire'
    },
    semester: 'Trimestre'
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