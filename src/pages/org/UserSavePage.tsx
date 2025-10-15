import {text} from "../../core/utils/text_display.ts";
import OutletPage from "../OutletPage.tsx";
import {ReactNode, useState} from "react";
import {AssignUser} from "../../components/common/AssignUser.tsx";

const UserSavePage = () => {
    const [successMessage, setSuccessMessage] = useState<ReactNode | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<ReactNode | undefined>(undefined)

    const breadCrumb = {
        bCItems: [
            {title: text.org.group.school.label, path: text.org.group.school.href},
            {title: text.org.group.user.label, path: text.org.group.user.href},
            {title: text.org.group.user.add.label},
        ],
        mBottom: 20
    }
    return(
        <OutletPage
            metadata={{title: 'Nouvelle utilisateur', description: 'Nouvelle utilisateur description'}}
            breadCrumb={breadCrumb}
            content={
                <AssignUser setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />
            }
            responseMessages={{
                error: errorMessage,
                success: successMessage,
            }}
        />
    )
}

export default UserSavePage