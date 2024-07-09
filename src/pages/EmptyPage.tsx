import {Button, Result} from "antd";
import {ReactNode} from "react";
import {useNavigation} from "../hooks/useNavigation.ts";
import {LuPlusCircle} from "react-icons/lu";

const EmptyPage = ({title, subTitle, icon, extra, btnLabel, btnUrl}: {title: ReactNode | string, subTitle?: ReactNode | string, icon?: ReactNode, extra?: ReactNode, btnLabel?: string, btnUrl?: string}) => {

    const navigate = useNavigation(btnUrl as string)

    const goThrough = () => {
        navigate()
    }

    return(
        <main className='empty__page__wrapper'>
            <Result
                className='empty__page__box'
                status='info'
                title={title}
                subTitle={subTitle}
                icon={
                    icon ? icon :
                        <span>
                    <img src="public/no-team-2.svg" alt="empty table image"/>
                </span>
                }
                extra={extra ? extra : <Button type='primary' icon={<LuPlusCircle size={15} />} onClick={btnUrl ? goThrough : () => {}}>{btnLabel}</Button>}
            />
        </main>

    )
}

export default EmptyPage