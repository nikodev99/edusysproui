import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";

const Setting = () => {

    useDocumentTitle({
        title: "Setting",
        description: "Setting description",
    })

    console.log("je suis dans le setting")

    return(
        <main>Setting Page</main>
    )
}

export default Setting