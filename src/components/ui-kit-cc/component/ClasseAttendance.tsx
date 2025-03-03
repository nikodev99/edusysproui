import {GenderCounted, InfoPageProps} from "../../../utils/interfaces.ts";
import {Classe} from "../../../entity";
import PageWrapper from "../../view/PageWrapper.tsx";
import {ClasseAttendanceAnalysis} from "./ClasseAttendanceAnalysis.tsx";

export const ClasseAttendance = (props: InfoPageProps<Classe> & {studentCount?: GenderCounted[] | null}) => {
    return (
        <PageWrapper>
            <ClasseAttendanceAnalysis {...props} />
        </PageWrapper>
    )
}