import '../ui.scss'
import {Flag} from "./Flag.tsx";

const PanelStat = ({title, subTitle, media, desc, src}: {title?: string | number, subTitle: string, media?: string, desc?: string, src?: boolean}) => {
    return (
        <div className='panel-head' key={subTitle}>
            <div className="stat">
                <div className='big-row'>{title}</div>
                <div className='small-row'>{subTitle}</div>
                <div className={!src ? 'round-row' : ''}>
                    {src ? <Flag  media={media} desc={desc} size={35} /> : <span>{media}</span>}
                </div>
                <div className='small-row'>{desc}</div>
            </div>
        </div>
    )
}

export default PanelStat