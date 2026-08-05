import {useNavigate} from "react-router-dom";
import {ReactNode} from "react";
import VoidData from "@/components/view/VoidData.tsx";

interface PanelTableProps {
    title: ReactNode
    panelColor?: string
    data?: {
        statement?: string | ReactNode
        response: string | number | ReactNode
        link?: string,
        onRedirect?: () => void
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
                        {!d.tableRow && (<div>{d.statement}</div>)}
                        {(d.link || d.onRedirect) ? (
                            <div className="linked" onClick={() => d.link ? goThrough(d.link!) : d.onRedirect ? d.onRedirect : undefined}>
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