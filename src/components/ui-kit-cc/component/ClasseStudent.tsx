import {GenderCounted, InfoPageProps, StudentListDataType} from "@/core/utils/interfaces.ts";
import {Classe} from "@/entity";
import PageWrapper from "@/components/view/PageWrapper.tsx";
import TabItem from "@/components/view/TabItem.tsx";
import {text} from "@/core/utils/text_display.ts";
import {StudentList} from "@/components/ui-kit-student/components/StudentList.tsx";
import {AxiosResponse} from "axios";
import {getClasseEnrolledStudentsSearch} from "@/data/repository/studentRepository.ts";
import {Card} from "antd";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import {useStudentRepo} from "@/hooks/actions/useStudentRepo.ts";
import {stringhelper} from "@/core/helpers/StringHelper.ts";

type ClasseStudentProps = InfoPageProps<Classe> & {
    studentCount?: GenderCounted | null
    totalStudents?: number
};

export const ClasseStudent = ({infoData, academicYear}: ClasseStudentProps) => {
    const {getPaginatedClasseStudents} = useStudentRepo()
    return(
        <PageWrapper>
            <TabItem
                title={<SuperWord input={`Composition de ${infoData?.name}`} />}
                items={[{key: '1', label: `Liste des ${stringhelper.setPlural(text.student.label)}`, children:
                    <>
                        <Card variant='borderless'>
                            <StudentList
                                callback={getPaginatedClasseStudents as never}
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