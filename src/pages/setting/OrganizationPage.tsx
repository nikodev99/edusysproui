import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import Responsive from "../../components/ui/layout/Responsive.tsx";
import Grid from "../../components/ui/layout/Grid.tsx";
import {Button, Card, Divider, Space, Typography, Avatar, Flex, Tag} from "antd";
import {useSchoolRepo} from "../../hooks/useSchoolRepo.ts";
import {
    AiOutlineDelete,
    AiOutlineEdit,
    AiOutlineFileText,
    AiOutlineProfile
} from "react-icons/ai";
import {chooseColor, cutStatement} from "../../core/utils/utils.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {
    LuBuilding2,
    LuCalendarClock,
    LuCircleCheckBig,
    LuGraduationCap,
    LuPencilOff,
    LuUsersRound
} from "react-icons/lu";
import {useAcademicYearRepo} from "../../hooks/useAcademicYearRepo.ts";
import {useUserRepo} from "../../hooks/useUserRepo.ts";
import {useGradeRepo} from "../../hooks/useGradeRepo.ts";
import {useDepartmentRepo} from "../../hooks/useDepartmentRepo.ts";
import {text} from "../../core/utils/text_display.ts";
import {Link} from "react-router-dom";
import {SchoolEditDrawer} from "../../components/ui-kit-setting";
import {useToggle} from "../../hooks/useToggle.ts";
import {useEffect, useState} from "react";
import {School} from "../../entity";

export const OrganizationPage = () => {

    useDocumentTitle({
        title: "Organization",
        description: "Setting description",
    })

    const {context} = useBreadCrumb({
        bCItems: [
            {title: 'Organisation'}
        ]
    })

    const [openEditDrawer, setOpenEditDrawer] = useToggle(false)
    const [refetch, setRefetch] = useState(false)
    const {useGetSchool} = useSchoolRepo()
    const {useGetCurrentAcademicYear} = useAcademicYearRepo()
    const {useCountUsers} = useUserRepo()
    const {useGetAllGrades} = useGradeRepo()
    const {useGetAllDepartments} = useDepartmentRepo()

    const school = useGetSchool(refetch)
    const academicYear = useGetCurrentAcademicYear()
    const userCount = useCountUsers()
    const grades = useGetAllGrades()
    const departments = useGetAllDepartments()

    useEffect(() => {
        if (refetch) {
            setRefetch(false);
        }
    }, [refetch]);


    const handleCloseDrawer = () => {
        setOpenEditDrawer()
        setRefetch(true)
    }

    const {Text, Link: TextLink} = Typography

    return(
        <>
        {context}
        <Divider orientation='left'><h3>Mon Organisation</h3></Divider>
        <Responsive gutter={[16, 16]}>
            <Grid xs={24} md={12} lg={6}>
                <Card bordered={false}>
                    <Card.Meta title={
                        <Flex align='center' justify={'space-between'} wrap>
                            <h3>{cutStatement(school?.name as string, 30, school?.abbr)}</h3>
                            <Button icon={<AiOutlineEdit />} onClick={setOpenEditDrawer} size='small' type='primary'>Modifier</Button>
                        </Flex>
                    } style={{marginBottom: '10px'}} />
                    <div>
                        <Text strong>Adresse:</Text>
                        <p>{school?.address?.street}</p>
                        <p>{school?.address?.city} ({school?.address?.zipCode})</p>
                        <p>{school?.address?.country}</p>
                    </div>
                    <Divider />
                    <div>
                        <Text strong>Contact:</Text>
                        <p>{school?.phoneNumber}</p>
                        {school?.contactEmail && <p><Link to={`mailto:${school?.contactEmail || ''}`}>{school?.contactEmail}</Link></p>}
                        {school?.websiteURL && <p><Link to={`${school?.websiteURL}`}>{school?.websiteURL}</Link></p>}
                    </div>
                    <Divider />
                    <div>
                        <Text strong>Accreditation:</Text>
                        <p>Code: {school?.accreditationCode}</p>
                        <p>Numéro: {school?.accreditationNumber}</p>
                    </div>
                    <Divider />
                    <Flex vertical justify='center' align='start'>
                        <Link className='add__btn' to={'#'}><AiOutlineFileText /> General Terms and Conditions</Link>
                        <Link className='add__btn' to={'#'}><AiOutlineProfile /> Special Contracts</Link>
                        <TextLink className='add__btn btn__danger'><AiOutlineDelete /> Supprimer l'organisation</TextLink>
                    </Flex>
                </Card>
            </Grid>
            <Grid xs={24} md={12} lg={16} xl={18}>
                <Responsive gutter={[16, 16]}>
                    <Grid xs={24} md={24} lg={24}>
                        <Card bordered={false}>
                            <Card.Meta title={
                                <Flex align='center' justify={'space-between'}>
                                    <h3>Customisation</h3>
                                    <Link to={text.settings.group.customize.href}>Modifier</Link>
                                </Flex>
                            } style={{marginBottom: '5px'}} />
                            <Space>
                                <div>
                                    <Avatar style={{background: chooseColor(school?.abbr)}} size={50} shape='square'>{school?.abbr?.toUpperCase()}</Avatar>
                                </div>
                                <Flex align={"start"} vertical>
                                    <Flex align={"center"} justify={"center"} gap={5}><p>Logo Organisation</p><LuCircleCheckBig style={{color: '#52c41a'}} /></Flex>
                                    <Flex align={"center"} justify={"center"} gap={5}><p>Logo Application</p><LuCircleCheckBig style={{color: '#52c41a'}} /></Flex>
                                </Flex>
                            </Space>
                            <Divider />
                            <Flex align={'center'} justify={'space-between'}>
                                <div>
                                    <Avatar shape='square' style={{background: "#000C40"}} size={40} icon={<LuPencilOff style={{color: '#fafbff'}} />} />
                                </div>
                                <Flex align={"end"} vertical>
                                    <Link to={'#'}>Apprendre plus</Link>
                                </Flex>
                            </Flex>
                        </Card>
                    </Grid>
                    <Grid xs={24} md={12} lg={12}>
                        <Card>
                            <Card.Meta title={
                                <Flex align='center' justify={'space-between'}>
                                    <h3>Année Académique Actuelle</h3>
                                </Flex>
                            } style={{marginBottom: '5px'}} />
                            <Space>
                                <div>
                                    <Avatar size={50} style={{background: '#000C40'}} icon={<LuCalendarClock style={{color: '#fafbff'}} />} />
                                </div>
                                <Flex align='start' justify={"center"} vertical gap={5}>
                                    <p>{academicYear?.academicYear}</p>
                                    <Link to={text.org.group.academicYear.href}>Manager</Link>
                                </Flex>
                            </Space>
                        </Card>
                    </Grid>
                    <Grid xs={24} md={12} lg={12}>
                        <Card>
                            <Card.Meta title={
                                <Flex align='center' justify={'space-between'}>
                                    <h3>Utilisateurs</h3>
                                </Flex>
                            } style={{marginBottom: '5px'}} />
                            <Space>
                                <Avatar style={{background: '#000C40'}} size={50} icon={<LuUsersRound style={{color: '#fafbff'}} />} />
                                <Flex align='start' justify='center' vertical gap={5}>
                                    <p>{userCount} Utilisateur{userCount > 1 ? 's' : ''}</p>
                                    <Link to={text.org.group.user.href}>Manager</Link>
                                </Flex>
                            </Space>
                        </Card>
                    </Grid>
                    <Grid xs={24} md={12} lg={12}>
                        <Card>
                            <Card.Meta title={
                                <Flex align='center' justify={'space-between'}>
                                    <h3>Grades</h3>
                                </Flex>
                            } style={{marginBottom: '5px'}} />
                            <Space>
                                <Avatar style={{background: '#000C40'}} size={50} icon={<LuGraduationCap style={{color: '#fafbff'}} />} />
                                <Flex align='start' justify='center' vertical gap={5}>
                                    <p>{grades?.length} grade{grades?.length > 1 ? 's' : ''}</p>
                                    {grades && <Flex gap={5}>{grades?.map(g => (<Tag key={`grade-${g.id}`}>{g.section}</Tag>))}</Flex>}
                                    <Link to={text.org.group.grade.href}>Manager</Link>
                                </Flex>
                            </Space>
                        </Card>
                    </Grid>
                    <Grid xs={24} md={12} lg={12}>
                        <Card>
                            <Card.Meta title={
                                <Flex align='center' justify={'space-between'}>
                                    <h3>Départements</h3>
                                </Flex>
                            } style={{marginBottom: '5px'}} />
                            <Space>
                                <Avatar style={{background: '#000C40'}} size={50} icon={<LuBuilding2 style={{color: '#fafbff'}} />} />
                                <Flex align='start' justify='center' vertical gap={5}>
                                    <p>{departments?.length} Départements{departments?.length > 1 ? 's' : ''}</p>
                                    {departments && <Flex gap={5}>{departments?.map(d => (<Tag key={`code-${d.id}`}>{d.code}</Tag>))}</Flex>}
                                    <Link to={text.org.group.department.href}>Manager</Link>
                                </Flex>
                            </Space>
                        </Card>
                    </Grid>
                </Responsive>
            </Grid>
        </Responsive>
        <section>
            <SchoolEditDrawer
                open={openEditDrawer}
                close={handleCloseDrawer}
                data={school as School}
            />
        </section>
        </>
    )
}