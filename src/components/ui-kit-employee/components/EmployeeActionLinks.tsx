import {CreateUser} from "../../common/CreateUser.tsx";
import {memo, useMemo} from "react";
import {UserType} from "../../../auth/dto/user.ts";
import {ActionLinksProps, ActionsButtons} from "../../../core/utils/interfaces.ts";

type EmployeeActionButtons = ActionsButtons

export const EmployeeActionLinks = memo(({open, setActions, personalInfo, show}: ActionLinksProps<EmployeeActionButtons>) => {
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
                userType={UserType.EMPLOYEE}
            />}
        </section>
    )
})