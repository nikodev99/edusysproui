import { Metadata } from "@/core/utils/interfaces.ts";
import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import {BCProps, useBreadCrumb} from "@/hooks/useBreadCrumb.tsx";
import {ReactNode} from "react";
import {Notification, NotificationProps} from "@/components/custom/Notification.tsx";
import PageWrapper from "@/components/view/PageWrapper.tsx";

export type OutletPageProps = {
    metadata: Metadata
    breadCrumb: BCProps
    content?: ReactNode
    children?: ReactNode
    setActivity?: () => Promise<boolean>
    onNotifClose?: () => void
} & NotificationProps

const OutletPage = ({metadata, breadCrumb, content, responseMessages, setRedirect, isNotif, onNotifClose, children, onlyNotif}: OutletPageProps) => {
    useDocumentTitle(metadata)

    const {context} = useBreadCrumb(breadCrumb)

    return <>
        {context}
        {(responseMessages && !children) && (
            <Notification isNotif={isNotif} setRedirect={setRedirect} responseMessages={responseMessages} onClose={onNotifClose} onlyNotif={onlyNotif} />
        )}
        {content ? content : (
            children && <PageWrapper>
                {responseMessages && (
                    <Notification isNotif={isNotif} setRedirect={setRedirect} responseMessages={responseMessages} onClose={onNotifClose} onlyNotif={onlyNotif} />
                )}
                {children}
            </PageWrapper>
        )}
    </>
}

export default OutletPage