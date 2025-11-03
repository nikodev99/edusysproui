import { Metadata } from "../core/utils/interfaces.ts";
import {useDocumentTitle} from "../hooks/useDocumentTitle.ts";
import {BCProps, useBreadCrumb} from "../hooks/useBreadCrumb.tsx";
import {ReactNode} from "react";
import FormSuccess from "../components/ui/form/FormSuccess.tsx";
import FormError from "../components/ui/form/FormError.tsx";
import {Alert} from "antd";

export interface OutletPageProps {
    metadata: Metadata
    breadCrumb: BCProps
    content: ReactNode
    responseMessages?: {success?: ReactNode, error?: ReactNode}
    setRedirect?: (url?: string) => void
    setActivity?: () => Promise<boolean>
    isNotif?: boolean
}

const OutletPage = ({metadata, breadCrumb, content, responseMessages, setRedirect, isNotif = true}: OutletPageProps) => {
    useDocumentTitle(metadata)

    const {context} = useBreadCrumb(breadCrumb)

    return <>
        {context}
        {responseMessages && (
            <>
                {responseMessages?.success && <FormSuccess message={responseMessages?.success} setRedirect={setRedirect} isNotif={isNotif}/>}
                {responseMessages?.error && <FormError message={responseMessages?.error} isNotif={isNotif}/>}

                {responseMessages?.success && <Alert type={'success'} message={responseMessages?.success} closeIcon showIcon style={{marginBottom: '10px'}}/>}
                {responseMessages?.error && <Alert type={'error'} message={responseMessages?.error} closeIcon showIcon style={{marginBottom: '10px'}}/>}
            </>
        )}
        {content}
    </>
}

export default OutletPage