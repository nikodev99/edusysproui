import {ResponsiveContainer, PieChart as ReChartPieChart, Pie, Cell, Legend} from "recharts";
import {PieChartProps} from "@/components/ui/ui_interfaces.ts";
import {COLOR} from "@/core/utils/utils.ts";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
    cx: number, cy: number, midAngle: number, innerRadius: number, outerRadius: number, percent: number, index: number
}) => {
    // Don't show labels for very small slices (less than 5%) to avoid clutter
    if (percent < 0.05) return null;

    // Position the label slightly further out from the center for better readability
    // Using 0.6 instead of 0.5 gives more breathing room
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"  // Center the text in its position for a cleaner look
            dominantBaseline="central"
            fontSize="14"  // Slightly larger for better readability
            fontWeight="600"  // Semi-bold makes percentages stand out
            style={{
                // Text shadow provides a contrast against any background color
                textShadow: '0px 0px 3px rgba(0, 0, 0, 0.8), 0px 0px 6px rgba(0, 0, 0, 0.6)',
                // Smooth rendering for crisp text
                paintOrder: 'stroke fill',
                stroke: 'rgba(0, 0, 0, 0.3)',
                strokeWidth: '0.5px'
            }}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const PieChart = (pieProps: PieChartProps) => {
    const {
        colors, width, height, data, outerRadius = 80, innerRadius = 40, defaultColor, activeIndex, hasLabel,
        activeShape, labelLine, onMouseEnter, minHeight, startAngle, endAngle, hasLegend, nameKey = 'name', plainColor
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
                    innerRadius={plainColor ? undefined : innerRadius}
                    outerRadius={plainColor ? undefined : outerRadius}
                    fill={"#8884d8"}
                    dataKey="value"
                    nameKey={nameKey}
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