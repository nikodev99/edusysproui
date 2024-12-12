import {Sector} from "recharts";
import {FC, useState} from "react";
import {PieChartDataEntry, PieChartProps} from "../ui/ui_interfaces.ts";
import PieChart from "./PieChart.tsx";
import {ActiveShape} from "recharts/types/util/types";
import {PieSectorDataItem} from "recharts/types/polar/Pie";

const renderActiveShape: FC<{
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    fill: string;
    payload: PieChartDataEntry;
    percent: number;
    value: number;
    name: string;
    valueText: (value: number) => string;
    percentText: (value: number) => string;
}> = (props) => {
    const RADIAN = Math.PI / 180;
    const { name, cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{name}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(${value} ≈ ${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};

export const ShapePieChart = (pieProps: PieChartProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const onPieEnter = (_: unknown, index: number) => {
        setActiveIndex(index);
    };

    return (
        <PieChart
            {...pieProps}
            activeIndex={activeIndex}
            activeShape={renderActiveShape as ActiveShape<PieSectorDataItem>}
            onMouseEnter={onPieEnter}
        />
    )
}