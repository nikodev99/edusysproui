export const text = {
    home: {
        label: 'Tableau de bord',
        href: '/dashboard'
    },
    student: {
        label: 'Étudiants',
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
        label: 'Tuteurs',
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
    schoolID: '81148a1b-bdb9-4be1-9efd-fdf4106341d6',
    http: 'http://localhost:5173'
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