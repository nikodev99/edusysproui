import {useNavigate} from "react-router-dom";

interface PanelTableProps {
    title: string
    data?: {
        statement: string,
        response?: string | number
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
                {data && data.map((d, i) => (
                    <div className="table-row" key={i}>
                        <p>{d.statement}</p>
                        {d.link ? (
                            <p className="linked" onClick={() => goThrough(d.link!)}>
                                {d.response}
                            </p>
                        ) : (
                            <p>{d.response}</p>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}

export default PanelTable