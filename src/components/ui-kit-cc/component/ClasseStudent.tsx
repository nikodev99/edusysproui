import {InfoPageProps, StudentListDataType} from "../../../utils/interfaces.ts";
import {Classe} from "../../../entity";
import PageWrapper from "../../view/PageWrapper.tsx";
import TabItem from "../../view/TabItem.tsx";
import {text} from "../../../utils/text_display.ts";
import {StudentList} from "../../ui-kit-student/components/StudentList.tsx";
import {fetchEnrolledClasseStudents} from "../../../data/action/studentAction.ts";
import {AxiosResponse} from "axios";
import {getClasseEnrolledStudentsSearch} from "../../../data/repository/studentRepository.ts";
import {Card} from "antd";
import {SuperWord} from "../../../utils/tsxUtils.tsx";

type ClasseStudentProps = InfoPageProps<Classe> & {setStudentCount?: (count: number) => void};

export const ClasseStudent = ({infoData, academicYear}: ClasseStudentProps) => {

    return(
        <PageWrapper>
            <TabItem
                title={<SuperWord input={`Composition de ${infoData?.name}`} />}
                items={[{key: '1', label: `Liste des ${text.student.label}s`, children: <Card bordered={false}>
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
                </Card>}
                ]}
            />
        </PageWrapper>
    )
}