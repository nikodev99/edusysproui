import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";

const UserSavePage = () => {
    const {context} = useBreadCrumb({
        bCItems: [
            {title: text.org.group.school.label, path: text.org.group.school.href},
            {title: text.org.group.user.label, path: text.org.group.user.href},
            {title: text.org.group.user.add.label},
        ]
    })
    return(
        <>
            {context}
            Ajouter un utilisateur
        </>
    )
}

export default UserSavePage