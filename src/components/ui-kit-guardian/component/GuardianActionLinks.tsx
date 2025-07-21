import {ActionLinksProps, ActionsButtons} from "../../../core/utils/interfaces.ts";
import {useMemo} from "react";
import {CreateUser} from "../../common/CreateUser.tsx";
import {UserType} from "../../../auth/dto/user.ts";

type GuardianActionButtons = ActionsButtons

export const GuardianActionLinks = ({open, show, setActions, personalInfo}: ActionLinksProps<GuardianActionButtons>) => {
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
                userType={UserType.GUARDIAN}
            />}
        </section>
    )
}