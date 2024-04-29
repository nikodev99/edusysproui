import {useEffect} from "react";
import {Metadata} from "../utils/interfaces.ts";
import {connectToElement} from "../utils/utils.ts";

export const useDocumentTitle = (metadata: Metadata) => {
    const {title, description} = metadata;

    useEffect( () => {
        document.title = title
        connectToElement("meta[name='description']", {
            content: description
        })
    }, [title, description]);
}