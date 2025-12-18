import { Metadata } from "@/core/utils/interfaces.ts";
import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import {BCProps, useBreadCrumb} from "@/hooks/useBreadCrumb.tsx";
import {ReactNode} from "react";
import {Notification, NotificationProps} from "@/components/custom/Notification.tsx";

export type OutletPageProps = {
    metadata: Metadata
    breadCrumb: BCProps
    content: ReactNode
    setActivity?: () => Promise<boolean>
} & NotificationProps

const OutletPage = ({metadata, breadCrumb, content, responseMessages, setRedirect, isNotif}: OutletPageProps) => {
    useDocumentTitle(metadata)

    const {context} = useBreadCrumb(breadCrumb)

    return <>
        {context}
        {responseMessages && (
            <Notification isNotif={isNotif} setRedirect={setRedirect} responseMessages={responseMessages} />
        )}
        {content}
    </>
}

export default OutletPage