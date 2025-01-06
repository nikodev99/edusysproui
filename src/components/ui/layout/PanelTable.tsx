import {useNavigate} from "react-router-dom";
import {ReactNode} from "react";
import VoidData from "../../view/VoidData.tsx";

interface PanelTableProps {
    title: ReactNode
    panelColor?: string
    data?: {
        statement?: string | ReactNode
        response: string | number | ReactNode
        link?: string,
        tableRow?: boolean
    }[],
    ps?: boolean
}

const PanelTable = ({title, data, panelColor, ps}: PanelTableProps) => {

    const navigate = useNavigate()

    const goThrough = (link: string) => navigate(link)

    return (
        <>
            <div className='table-head' style={panelColor ? {backgroundColor: panelColor}: {}}><span>{title}</span></div>
            <div className='table-body' style={ps ? {padding: '0 12px'}: undefined}>
                {!data || data?.length === 0 ? <VoidData /> : data?.map((d, i) => (
                    <div className={d.tableRow ? '' : "table-row"} key={`${d.statement}-${i}`}>
                        <div>{d.statement}</div>
                        {d.link ? (
                            <div className="linked" onClick={() => goThrough(d.link!)}>
                                {d.response}
                            </div>
                        ) : (
                            <div>{d.response}</div>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}

export default PanelTable