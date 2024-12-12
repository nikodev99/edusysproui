import {PieChartProps} from "../ui/ui_interfaces.ts";
import PieChart from "./PieChart.tsx";


const AnglePieChart = (pieProps: PieChartProps) => {
    return(
        <PieChart
            {...pieProps}
            startAngle={180}
            endAngle={0}
        />
    )
}

export default AnglePieChart