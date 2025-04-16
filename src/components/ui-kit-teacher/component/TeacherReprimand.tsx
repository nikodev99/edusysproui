import {InfoPageProps} from "../../../core/utils/interfaces.ts";
import {Teacher} from "../../../entity";

export const TeacherReprimand = ({infoData}: InfoPageProps<Teacher>) => {
    console.log(infoData)
    return(
        <div>Student reprimanded</div>
    )
}