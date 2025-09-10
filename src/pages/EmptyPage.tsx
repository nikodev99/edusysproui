import {Button, Result} from "antd";
import {ReactNode} from "react";
import {useNavigation} from "../hooks/useNavigation.ts";
import {LuCirclePlus} from "react-icons/lu";

const EmptyPage = ({title, subTitle, icon, extra, btnLabel, btnUrl, btnIcon, mt}: {
    title: ReactNode | string,
    subTitle?: ReactNode | string,
    icon?: ReactNode,
    extra?: ReactNode,
    btnLabel?: string,
    btnUrl?: string,
    btnIcon?: ReactNode,
    mt?: boolean,
}) => {

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
                    icon ? icon : (
                        <span>
                            <img src="/no-team-2.svg" alt="empty table image"/>
                        </span>
                    )
                }
                style={{marginTop: mt ? '80px' : '0'}}
                extra={extra ? extra : <Button
                    type='primary'
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    onClick={btnUrl ? goThrough : () => {}}
                >
                    {btnIcon ?? <LuCirclePlus size={15}/>}
                    {btnLabel}
                </Button>}
            />
        </main>

    )
}

export default EmptyPage