import {ResponsiveContainer, PieChart as ReChartPieChart, Pie, Cell, Legend} from "recharts";
import {PieChartProps} from "../ui/ui_interfaces.ts";
import {COLOR} from "../../core/utils/utils.ts";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
    cx: number, cy: number, midAngle: number, innerRadius: number, outerRadius: number, percent: number, index: number
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const PieChart = (pieProps: PieChartProps) => {
    const {
        colors, width, height, data, outerRadius = 80, innerRadius = 40, defaultColor, activeIndex, hasLabel,
        activeShape, labelLine, onMouseEnter, minHeight, startAngle, endAngle, hasLegend
    } = pieProps

    const CUSTOM_COLOR = (() => {
        if (colors && defaultColor) {
            return [defaultColor, ...colors];
        }
        if (!colors && defaultColor) {
            return [defaultColor, ...COLOR];
        }
        if (colors && !defaultColor) {
            return colors;
        }
        return COLOR;
    })();

    return (
        <ResponsiveContainer width={width || "100%"} height={height || 400} minHeight={minHeight}>
            <ReChartPieChart>
                <Pie
                    activeIndex={activeIndex}
                    activeShape={activeShape}
                    data={data}
                    cx="50%"
                    cy="50%"
                    startAngle={startAngle}
                    endAngle={endAngle}
                    labelLine={labelLine ?? false}
                    label={hasLabel ? renderCustomizedLabel : undefined}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius || 80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onMouseEnter}
                >
                    {data?.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={
                            _entry.color ? _entry.color : CUSTOM_COLOR[index % CUSTOM_COLOR.length]
                        } />
                    ))}
                </Pie>
                {hasLegend && <Legend />}
            </ReChartPieChart>
        </ResponsiveContainer>
    )
}

export default PieChart;