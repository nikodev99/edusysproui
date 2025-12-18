import OutletPage from "@/pages/OutletPage.tsx";
import {text} from "@/core/utils/text_display.ts";
import {getStringAcademicYear, setFirstName, setPlural} from "@/core/utils/utils.ts";
import PageWrapper from "@/components/view/PageWrapper.tsx";
import Responsive from "@/components/ui/layout/Responsive.tsx";
import Grid from "@/components/ui/layout/Grid.tsx";
import {Select} from "antd";
import {PageTitle} from "@/components/custom/PageTitle.tsx";
import {useSearch} from "@/hooks/useSearch.ts";
import {useMemo, useState} from "react";
import {Enrollment, Individual} from "@/entity";
import {useStudentRepo} from "@/hooks/actions/useStudentRepo.ts";
import {StudentResult} from "@/components/ui-kit-student";
import {useActivity} from "@/hooks/useActivity.ts";

const ReEnrollStudentPage = () => {
    const {reenrollStudentActivity} = useActivity()

    const [searchValue, setSearchValue] = useState<number | undefined>(undefined)

    const {findUnenrolledStudents, studentOptions} = useStudentRepo()

    const {fetching, resource, options, handleSearch, handleChange} = useSearch<Enrollment>({
        setValue: setSearchValue as (value: unknown) => void,
        fetchFunc: findUnenrolledStudents as never,
        setCustomOptions: studentOptions
    })

    const {academicYear, classe, ind} = useMemo(() => ({
        academicYear: resource?.academicYear,
        classe: resource?.classe,
        ind: resource?.student?.personalInfo
    }), [resource])

    const handleActivity = () => reenrollStudentActivity(ind as Individual, classe?.name as string)

    return(
        <OutletPage
            setActivity={handleActivity}
            metadata={{
                title: text.student.group.reAdd.label,
                description: "Re-inscription description",
            }}
            breadCrumb={{
                bCItems: [
                    {title: setPlural(text.student.label), path: text.student.href},
                    {title: text.student.group.reAdd.label}
                ]
            }}
            content={
                <>
                    <PageTitle title={"Réinscription"} description={<span>
                        Cette page vous permet de réinscrire vos anciens élèves. Recherchez un ancien élève de l’établissement
                        par son nom, prénom ou numéro de référence pour le réinscrire. Utilisez la sélection dans
                        la liste de résultats pour vérifier les informations de l’élève, choisissez la nouvelle classe puis confirmez la réinscription.
                    </span>} />
                    <PageWrapper>
                        <Responsive gutter={[16, 16]} align='middle' justify='center'>
                            <Grid xs={24} md={12} lg={12}>
                                <Select
                                    placeholder={`Rechercher l'ancien ${(text.student.label).toLowerCase()} à réinscrire`}
                                    filterOption={false}
                                    onSearch={handleSearch}
                                    onChange={handleChange}
                                    notFoundContent={fetching ? 'Loading...' : null}
                                    options={options}
                                    showSearch
                                    value={searchValue}
                                    style={{width: '100%', height: '40px'}}
                                />
                            </Grid>
                        </Responsive>
                        {resource && <StudentResult
                            title={`Dernière inscription année ${getStringAcademicYear(academicYear)}`}
                            resource={resource}
                            modalTitle={`Voulez vraiment continuer avec la ré-inscription de ${setFirstName(`${ind?.lastName} ${ind?.firstName}`)}`}
                            submitBtnTxt='Réinscrire'
                        />}
                    </PageWrapper>
                </>
            }
        />
    )
}

export default ReEnrollStudentPage;