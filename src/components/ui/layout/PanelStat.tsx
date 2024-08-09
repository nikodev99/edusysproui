import '../ui.scss'

const PanelStat = ({title, subTitle, media, desc, src}: {title?: string | number, subTitle: string, media?: string, desc?: string, src?: boolean}) => {
    return (
        <div className='panel-head'>
            <div className="stat">
                <div className='big-row'>{title}</div>
                <div className='small-row'>{subTitle}</div>
                <div className='round-row'>
                    {src ? <img
                            alt={`Drapeau ${desc}`}
                            src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${media?.toUpperCase()}.svg`} /> :
                        <span>{media}</span>}
                </div>
                <div className='small-row'>{desc}</div>
            </div>
        </div>
    )
}

export default PanelStat