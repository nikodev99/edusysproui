import {Layout} from "antd";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";

const Setting = () => {

    useDocumentTitle({
        title: "Setting",
        description: "Setting description",
    })

    console.log("je suis dans le setting")

    return(
        <Layout.Content>
            <div>Setting Page</div>
        </Layout.Content>
    )
}

export default Setting