import {useEffect} from "react";
import {Metadata} from "../utils/interfaces.ts";
import {connectToElement} from "../utils/utils.ts";

export const useDocumentTitle = (metadata: Metadata) => {
    const {title, description, hasEdu = true} = metadata;

    useEffect( () => {
        document.title = hasEdu ? `EduSysPro - ${title}` : title
        connectToElement("meta[name='description']", {
            content: description
        })
    }, [title, description, hasEdu]);
}