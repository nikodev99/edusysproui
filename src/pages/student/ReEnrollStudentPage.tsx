import OutletPage from "../OutletPage.tsx";
import {text} from "../../core/utils/text_display.ts";
import {getAge, getStringAcademicYear, setFirstName, setPlural} from "../../core/utils/utils.ts";
import PageWrapper from "../../components/view/PageWrapper.tsx";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import Grid from "../../components/ui/layout/Grid.tsx";
import {Badge, Card, Descriptions, Form, Select, Spin, Tag} from "antd";
import {PageTitle} from "../../components/custom/PageTitle.tsx";
import {useSearch} from "../../hooks/useSearch.ts";
import {ReactNode, useEffect, useMemo, useState, useTransition} from "react";
import {Enrollment} from "../../entity";
import {useStudentRepo} from "../../hooks/actions/useStudentRepo.ts";
import Datetime from "../../core/datetime.ts";
import {AcademicForm} from "../../components/ui-kit-student";
import {useForm} from "react-hook-form";
import {enrollmentSchema, EnrollmentSchema} from "../../schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {ModalConfirmButton} from "../../components/ui/layout/ModalConfirmButton.tsx";
import {addStudent} from "../../data";
import {LuUserRoundPlus} from "react-icons/lu";
import {useRedirect} from "../../hooks/useRedirect.ts";

const ReEnrollStudentPage = () => {
    const {toViewStudent} = useRedirect()

    const [searchValue, setSearchValue] = useState<number | undefined>(undefined)
    const [successMessage, setSuccessMessage] = useState<ReactNode | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<ReactNode | undefined>(undefined)
    const [isPending, startTransition] = useTransition()

    const {findUnenrolledStudents, studentOptions} = useStudentRepo()

    const {fetching, resource, options, handleSearch, handleChange} = useSearch<Enrollment>({
        setValue: setSearchValue as (value: unknown) => void,
        fetchFunc: findUnenrolledStudents as never,
        setCustomOptions: studentOptions
    })

    const {academicYear, classe, student, ind} = useMemo(() => ({
        academicYear: resource?.academicYear,
        classe: resource?.classe,
        student: resource?.student,
        ind: resource?.student?.personalInfo
    }), [resource])

    const {control, formState: {errors}, watch, handleSubmit, reset} = useForm<EnrollmentSchema>({
        defaultValues: {
            student: {
                id: student?.id,
            },
            classe: {
                id: classe?.id,
            }
        },
        resolver: zodResolver(enrollmentSchema(true))
    })

    useEffect(() => {
        reset({
            student: { id: student?.id ?? "" },
            classe:  { id: classe?.id  ?? 0 },
        });
    }, [student?.id, classe?.id, reset]);

    console.log("WATCHER: ", watch(), " ERRORS: ", errors)

    const onSubmit = (data: EnrollmentSchema) => {
        setErrorMessage("")
        setSuccessMessage("")

        console.log("DATA: ", data)

        startTransition(() => {

            addStudent(data, true)
                .then((res) => {
                    console.log("RES: ", res)
                    setErrorMessage(res?.error)
                    if (res.isSuccess) {
                        setSuccessMessage(res?.success)
                        reset()
                    }
                })
        })
    }

    return(
        <OutletPage
            responseMessages={{
                success: successMessage,
                error: errorMessage
            }}
            setRedirect={() => toViewStudent(student?.id as string, ind)}
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
                                    style={{width: '100%'}}
                                />
                            </Grid>
                        </Responsive>
                        {resource && <Responsive gutter={[16, 16]} style={{marginTop: '30px'}}>
                            <Grid xs={24} md={12} lg={12}>
                                <Card>
                                    <Descriptions
                                        title={`Dernière inscription année ${getStringAcademicYear(academicYear)}`}
                                        items={[
                                            {key: '1', label: 'Nom(s)', children: ind?.lastName, span: 3},
                                            {key: '2', label: 'Prenom(s)', children: ind?.firstName, span: 3},
                                            {key: '3', label: 'Date de Naissance', children: Datetime.of(ind?.birthDate as Date).fDate(), span: 3},
                                            {key: '4', label: 'Age', children: getAge(ind?.birthDate as number[], true), span: 3},
                                            {key: '5', label: 'Lieu de naissance', children: ind?.birthCity, span: 3},
                                            {key: '6', label: 'Référence', children: <b>{ind?.reference}</b>, span: 3},
                                            {key: '7', label: 'Classe', children: classe?.name, span: 3},
                                            {key: '8', label: 'Niveau', children: <Tag>{classe?.grade?.section}</Tag>, span: 3},
                                            {key: '9', label: 'Date d\'inscription', children: Datetime.of(resource?.enrollmentDate).fDatetime(), span: 3},
                                            {key: '10', label: 'Archivé', children: <Badge status="error" text={resource?.isArchived ? 'Oui' : 'Non'} />},
                                        ]}
                                    />
                                </Card>
                            </Grid>
                            <Grid xs={24} md={12} lg={12}>
                                <Card>
                                    <Form layout='vertical'>
                                        <AcademicForm
                                            control={control}
                                            errors={errors}
                                            validationTriggered={true}
                                        />
                                        <Form.Item>
                                            <ModalConfirmButton
                                                btnProps={{
                                                    icon: <LuUserRoundPlus />,
                                                    type: 'primary'
                                                }}
                                                btnTxt={'Ré-inscrire'}
                                                title={`Voulez vraiment continuer avec la ré-inscription de ${setFirstName(`${ind?.lastName} ${ind?.firstName}`)}`}
                                                handleFunc={() => handleSubmit(onSubmit)()}
                                            />
                                        </Form.Item>
                                        {isPending && <Spin />}
                                    </Form>
                                </Card>
                            </Grid>
                        </Responsive>}
                    </PageWrapper>
                </>
            }
        />
    )
}

export default ReEnrollStudentPage;