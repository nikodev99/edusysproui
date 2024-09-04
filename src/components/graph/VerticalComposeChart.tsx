import {
    Bar,
    CartesianGrid, Cell,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {Color} from "../../utils/interfaces.ts";

interface ComposeChartProps {
    data: {name: string, valeur: number, '%': number}[],
    gridColor?: string,
    barColor?: Color[],
    lineColor?: string,
}

const VerticalComposeChart = ({data, gridColor, barColor, lineColor}: ComposeChartProps) => {

    const COLORS = barColor ? barColor : ['#0088FE', '#00C49F', '#FFBB28'];

    return(
        <ResponsiveContainer width="100%" height="100%" minHeight={320}>
            <ComposedChart
                layout="vertical"
                width={500}
                height={400}
                data={data}
                margin={{
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10,
                }}
            >
                <CartesianGrid stroke={`${gridColor ? gridColor : '#f5f5f5'}`} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" scale="band" />
                <Tooltip />
                <Bar dataKey="valeur" barSize={30} fill={`${barColor ? barColor : '#413ea0'}`}>
                    {data.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
                <Line dataKey="%" stroke={`${lineColor ? lineColor : '#ff7300'}`} />
            </ComposedChart>
        </ResponsiveContainer>
    )
}

export default VerticalComposeChart;