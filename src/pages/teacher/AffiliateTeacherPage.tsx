import OutletPage from "@/pages/OutletPage.tsx";
import {text} from "@/core/utils/text_display.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {setName, setPlural} from "@/core/utils/utils.ts";
import {PageTitle} from "@/components/custom/PageTitle.tsx";
import PageWrapper from "@/components/view/PageWrapper.tsx";
import Grid from "@/components/ui/layout/Grid.tsx";
import {Button, Divider, Flex, Form, Input, Skeleton} from "antd";
import Responsive from "@/components/ui/layout/Responsive.tsx";
import {useState} from "react";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {TeacherResult} from "@/components/ui-kit-teacher";
import VoidData from "@/components/view/VoidData.tsx";

const AffiliateTeacherPage = () => {
    const [error, setError] = useState<string | undefined>(undefined)
    const [searchValue, setSearchValue] = useState<string | undefined>(undefined)
    const {toTeacher, toAddTeacher} = useRedirect()
    const {useGetSearchedTeacher} = useTeacherRepo()

    const {data: teacher, isLoading} = useGetSearchedTeacher(searchValue as string)

    const handleSearch = (value: string) => {
        const reg = /^[\p{L}\d\s-]+$/u;
        if(reg.test(value))
            setSearchValue(value)
        else
            setError("Votre recherche ne doit contenir que des lettres, des espaces ou des chiffre pour la référence de l'élève.")
    }

    return(
        <OutletPage
            metadata={{
                title: text.teacher.group.affiliate.label,
                description: "Affiliate a teacher description"
            }}
            breadCrumb={{
                bCItems: [
                    {title: setPlural(text.teacher.label), setRedirect: toTeacher},
                    {title: text.teacher.group.affiliate.label}
                ]
            }}
            content={<main>
                <PageTitle
                    title={text.teacher.group.affiliate.label}
                    description={<span>
                        Cette page vous permet d'affilié de nouveaux enseignants, déjà enregistré par d'autres écoles, dans votre établissement.
                        Recherchez l'enseignant par son complet: Nom(s) + Prénoms(s) ou par son numéro de référence pour le retrouver et l'affilié
                        à votre établissement.
                    </span>}
                />
                <PageWrapper styles={{marginBottom: 15}}>
                    <Responsive gutter={[16, 16]} align='middle' justify='center'>
                        <Grid xs={24} md={12} lg={12}>
                            <Form>
                                <Form.Item
                                    tooltip={{title: 'Recherchez un enseignant en saisissant son nom complet suivit ' +
                                            'de son prénom complet tels qu’enregistrés dans le système, ou en entrant son numéro ' +
                                            'de référence.'
                                    }}
                                    label='Recherche'
                                    help={(error && !teacher) && <small>{error}</small>}
                                    validateStatus={(error && !teacher) ? 'error' : ''}
                                >
                                    <Input.Search
                                        placeholder={`Rechercher un ${(text.student.label).toLowerCase()} à inscrire`}
                                        style={{width: '100%', height: '40px'}}
                                        size='large'
                                        allowClear
                                        onClear={() => setSearchValue("")}
                                        variant='filled'
                                        onSearch={handleSearch}
                                    />
                                </Form.Item>
                            </Form>
                        </Grid>
                    </Responsive>
                    {teacher && <div><Divider orientation='left'>{`${text.student.label} trouvé`}</Divider>
                        <Flex justify='space-between' align='center'>
                            <span style={{fontSize: 20, fontWeight: 700}}>{setName(teacher?.personalInfo)}</span>
                            <Button type='primary' size='middle' onClick={() => toAddTeacher(undefined, true, teacher) }>Affilier</Button>
                        </Flex>
                        <Divider /></div>}
                </PageWrapper>
                {isLoading ?
                    <Skeleton active={isLoading} paragraph={{rows: 5}} />
                    : teacher ?
                        <TeacherResult resource={teacher} />
                        : searchValue && <div style={{width: '40%', margin: '0 auto'}}>
                        <VoidData title={`Recherche: ${searchValue}, Aucun résultat trouvé`} />
                    </div>}
            </main>}
        />
    )
}

export default AffiliateTeacherPage