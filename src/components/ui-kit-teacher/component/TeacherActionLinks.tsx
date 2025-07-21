import {ActionLinksProps, ActionsButtons} from "../../../core/utils/interfaces.ts";
import {useMemo} from "react";
import {CreateUser} from "../../common/CreateUser.tsx";
import {UserType} from "../../../auth/dto/user.ts";

type TeacherActionButtons = ActionsButtons

export const TeacherActionLinks = ({open, setActions, personalInfo, show}: ActionLinksProps<TeacherActionButtons>) => {
    const openCreateUser = useMemo(() => !!open.createUser, [open.createUser])
    const showCreateUser = useMemo(() => !!show.createUser, [show.createUser])

    const handleCloseCreateUser = () => {
        setActions({createUser: false})
    }

    return (
        <section>
            {!showCreateUser && <CreateUser
                open={openCreateUser}
                onCancel={handleCloseCreateUser}
                personalInfo={personalInfo}
                userType={UserType.TEACHER}
            />}
        </section>
    )
}