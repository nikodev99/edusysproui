import {useEffect} from "react";
import {Metadata} from "../core/utils/interfaces.ts";
import {connectToElement} from "../core/utils/utils.ts";

export const useDocumentTitle = (metadata: Metadata) => {
    const {title, description, hasEdu = true} = metadata;

    useEffect( () => {
        document.title = hasEdu ? `EduSysPro - ${title}` : title
        connectToElement("meta[name='description']", {
            content: description
        })
    }, [title, description, hasEdu]);
}