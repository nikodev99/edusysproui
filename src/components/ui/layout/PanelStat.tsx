import '../ui.scss'
import {Flag} from "./Flag.tsx";
import {ReactNode} from "react";
import {isString} from "../../../core/utils/utils.ts";

const PanelStat = (
    {title, subTitle, media, desc, src, round}: {
        title?: ReactNode | number, subTitle?: string, media?: ReactNode | string, desc?: ReactNode | string, src?: boolean, round?: ReactNode
}) => {
    return (
        <div className='panel-head' key={subTitle}>
            <div className="stat">
                <div className='big-row'>{title}</div>
                <div className='small-row'>{subTitle}</div>
                {round ? round : <div className={!src ? 'round-row' : ''}>
                    {src ? <Flag  media={media as string} desc={desc as string} size={35} /> : isString(media) ? <span>{media}</span> : media}
                </div>}
                <div className='small-row'>{desc}</div>
            </div>
        </div>
    )
}

export default PanelStat