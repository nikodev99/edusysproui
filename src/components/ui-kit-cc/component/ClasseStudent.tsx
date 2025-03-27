import {GenderCounted, InfoPageProps, StudentListDataType} from "../../../core/utils/interfaces.ts";
import {Classe} from "../../../entity";
import PageWrapper from "../../view/PageWrapper.tsx";
import TabItem from "../../view/TabItem.tsx";
import {text} from "../../../core/utils/text_display.ts";
import {StudentList} from "../../ui-kit-student/components/StudentList.tsx";
import {fetchEnrolledClasseStudents} from "../../../data/action/studentAction.ts";
import {AxiosResponse} from "axios";
import {getClasseEnrolledStudentsSearch} from "../../../data/repository/studentRepository.ts";
import {Card} from "antd";
import {SuperWord} from "../../../core/utils/tsxUtils.tsx";
//import Responsive from "../../ui/layout/Responsive.tsx";
//import Grid from "../../ui/layout/Grid.tsx";
//import PieChart from "../../graph/PieChart.tsx";
//import {Gender} from "../../../entity/enums/gender.tsx";

type ClasseStudentProps = InfoPageProps<Classe> & {
    studentCount?: GenderCounted[] | null
    totalStudents?: number
};

//TODO Maybe adding some info to this page as I'm lacking ideas.
/*const StudentSpecialInfo = ({studentCount}: { studentCount?: GenderCounted[] | null }) => {

    const pieChartData = studentCount && studentCount?.map(s => ({
        name: Gender[s.gender as unknown as keyof typeof Gender],
        value: s.count,
        color: s.gender === Gender.HOMME ? '#005F73' : s.gender === Gender.FEMME ? '#FF69B4' : '#9966CC'
    }))

    return(
        <Responsive gutter={[16, 16]} style={{margin: '0 10px'}}>
            <Grid xs={24} md={12} lg={12}>
                <Card>
                    <PieChart data={pieChartData as []} hasLegend hasLabel height={200} />
                </Card>
            </Grid>
            <Grid xs={24} md={12} lg={12}>
                <Card>
                    <PieChart data={pieChartData as []} hasLegend hasLabel height={200} />
                </Card>
            </Grid>
        </Responsive>
    )
}*/

export const ClasseStudent = ({infoData, academicYear}: ClasseStudentProps) => {

    return(
        <PageWrapper>
            <TabItem
                title={<SuperWord input={`Composition de ${infoData?.name}`} />}
                items={[{key: '1', label: `Liste des ${text.student.label}s`, children:
                    <>
                        <Card bordered>
                            <StudentList
                                callback={fetchEnrolledClasseStudents as () => Promise<AxiosResponse<StudentListDataType>>}
                                searchCallback={getClasseEnrolledStudentsSearch as (...input: unknown[]) => Promise<AxiosResponse<StudentListDataType[]>>}
                                callbackParams={[infoData?.id, academicYear]}
                                searchCallbackParams={[infoData?.id, academicYear]}
                                localStorage={{
                                    activeIcon: 'classeStudentsActiveIcon'
                                }}
                                infinite={true}
                            />
                        </Card>
                    </>
                }
                ]}
            />
        </PageWrapper>
    )
}