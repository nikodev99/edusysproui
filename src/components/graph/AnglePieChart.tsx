import {PieChartProps} from "../ui/ui_interfaces.ts";
import PieChart from "./PieChart.tsx";
import {Skeleton} from "antd";


const AnglePieChart = (pieProps: PieChartProps) => {
    const {isLoading} = pieProps
    return(
        <>
            {
                isLoading ? <Skeleton active={isLoading} loading={isLoading}/> : <PieChart
                    {...pieProps}
                    startAngle={180}
                    endAngle={0}
                />
            }
        </>
    )
}

export default AnglePieChart