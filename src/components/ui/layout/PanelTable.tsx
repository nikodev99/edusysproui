import {useNavigate} from "react-router-dom";
import {ReactNode} from "react";
import VoidData from "./VoidData.tsx";

interface PanelTableProps {
    title: string
    data?: {
        statement?: string
        response: string | number | ReactNode
        link?: string
    }[]
}

const PanelTable = ({title, data}: PanelTableProps) => {

    const navigate = useNavigate()

    const goThrough = (link: string) => navigate(link)

    return (
        <>
            <div className="table-head"><span>{title}</span></div>
            <div className="table-body">
                {data?.length === 0 ? <VoidData /> : data?.map((d, i) => (
                    <div className="table-row" key={`${d.statement}-${i}`}>
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