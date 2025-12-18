import OutletPage from "@/pages/OutletPage.tsx";
import {text} from "@/core/utils/text_display.ts";
import {PageTitle} from "@/components/custom/PageTitle.tsx";
import PageWrapper from "@/components/view/PageWrapper.tsx";
import Grid from "@/components/ui/layout/Grid.tsx";
import {Descriptions, Form, Input, Skeleton} from "antd";
import Responsive from "@/components/ui/layout/Responsive.tsx";
import {useActivity} from "@/hooks/useActivity.ts";
import {useEffect, useState} from "react";
import {useStudentRepo} from "@/hooks/actions/useStudentRepo.ts";
import {StudentResult} from "@/components/ui-kit-student";
import {useLocation} from "react-router-dom";
import {setFirstName} from "@/core/utils/utils.ts";
import {Individual} from "@/entity";

const SearchablePage = () => {
    const {enrollStudentActivity} = useActivity()
    const location = useLocation()

    const [error, setError] = useState<string | undefined>(undefined)
    const [searchValue, setSearchValue] = useState<string | undefined>(undefined)

    const locationState: string = location.state || undefined

    const {useGetSearchStudent} = useStudentRepo()

    const {data: student, isLoading} = useGetSearchStudent(searchValue as string)

    useEffect(() => {
        if (locationState) {
            setSearchValue(locationState)
        }
    }, [locationState]);

    const handleSearch = (value: string) => {
        const reg = /^[\p{L}\d\s-]+$/u;
        if(reg.test(value))
            setSearchValue(value)
        else
            setError("Votre recherche ne doit contenir que des lettres, des espaces ou des chiffre pour la référence de l'élève.")
    }

    const handleActivity = () => {
        return enrollStudentActivity(student?.student?.personalInfo as Individual, student?.classe?.name as string)
    }

    return(
        <OutletPage
            metadata={{
                title: text.search.label,
                description: "Recherche description"
            }}
            breadCrumb={{
                bCItems: [
                    {title: text.search.label}
                ]
            }}
            setActivity={handleActivity}
            content={
            <>
                <PageTitle title={"Recherche"} description={<p>
                    Cette page vous permet de rechercher les potentiels élèves à inscrire. Recherchez un élève d’un autre établissement
                    par son nom et prénom complet ou son numéro de référence pour l'inscrire à votre école. Utilisez la sélection dans
                    la liste de résultats pour vérifier les informations de l’élève, choisissez la nouvelle classe puis confirmez la réinscription.
                </p>} />
                <PageWrapper>
                    <Responsive gutter={[16, 16]} align='middle' justify='center'>
                        <Grid xs={24} md={12} lg={12}>
                            <Form>
                                <Form.Item
                                    tooltip={{title: 'Recherchez un élève en saisissant son nom complet suivit ' +
                                        'de son prénom complet tels qu’enregistrés dans le système, ou en entrant son numéro ' +
                                        'de référence au sein de son établissement.'
                                    }}
                                    label='Recherche'
                                    help={(error && !student) && <small>{error}</small>}
                                    validateStatus={(error && !student) ? 'error' : ''}
                                >
                                    <Input.Search
                                        placeholder={`Rechercher un ${(text.student.label).toLowerCase()} à inscrire`}
                                        style={{width: '100%', height: '40px'}}
                                        size='large'
                                        allowClear
                                        variant='filled'
                                        onSearch={handleSearch}
                                    />
                                </Form.Item>
                            </Form>
                        </Grid>
                    </Responsive>
                    {isLoading ?
                        <Skeleton active={isLoading} />
                        : student ?
                            <StudentResult
                                title={`${text.student.label} trouvé`}
                                resource={student}
                                modalTitle={`Voulez vraiment continuer avec l'inscription de ${setFirstName(
                                    `${student?.student?.personalInfo?.lastName} ${student?.student?.personalInfo?.firstName}`
                                )}`}
                            />
                        : searchValue && <div style={{width: '40%', margin: '0 auto'}}>
                        <Descriptions title={`${text.student.label} recherché: ${searchValue}`} items={[
                            {key: '1', children: <p>Aucun resultat trouvé</p>}
                        ]} />
                    </div>}
                </PageWrapper>
            </>
            }
        />
    )
}

export default SearchablePage