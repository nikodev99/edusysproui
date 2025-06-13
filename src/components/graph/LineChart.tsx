import {ChartProps, LineProps} from "../ui/ui_interfaces.ts";
import {
    ResponsiveContainer,
    LineChart as ReLineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line
} from "recharts";
import {setGraphColor} from "../../core/utils/utils.ts";
import {Skeleton} from "antd";

type LineChartProps<TData> = ChartProps<TData> & LineProps

const LineChart = <TData extends object>(
    {height = 400, minHeight= 400, data, showCartesian, legend, color, isPercent, showLegend, dataKey, type, isLoading}: LineChartProps<TData>
) => {

    const keys = dataKey
    const setColor = (index: number) => {
        return setGraphColor(color as string, index)
    }

    return(
        <ResponsiveContainer width='100%' height={height} minHeight={minHeight}>
            {isLoading ? <Skeleton loading={isLoading} active={isLoading} paragraph={{rows: 10, width: '100%'}} /> :
                <ReLineChart data={data}>
                    {showCartesian && <CartesianGrid strokeDasharray="3 3" />}
                    <XAxis dataKey={legend as string} />
                    <YAxis unit={isPercent ? '%' : undefined} />
                    <Tooltip formatter={isPercent ? (value) => value + '%' : undefined} />
                    {showLegend && <Legend />}
                    {keys && keys?.length && keys.map((key, index) => (
                        <Line
                            dataKey={key as string}
                            key={index}
                            type={type}
                            stroke={'color' in data ? data?.color as string : setColor(index)}
                            fill={'color' in data ? data?.color as string : setColor(index)}
                        />
                    ))}
                </ReLineChart>
            }
        </ResponsiveContainer>
    )
}

export {LineChart}