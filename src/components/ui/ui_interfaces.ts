import {ActiveShape, Margin} from "recharts/types/util/types";
import {Color} from "../../utils/interfaces.ts";
import {PieSectorDataItem} from "recharts/types/polar/Pie";

export interface AvatarProps {
    image?: string,
    firstName?: string,
    lastName?: string,
    reference?: string
}

export type PieChartDataEntry = {
    name?: string;
    value?: number;
    color?: string;
}

export interface PieChartProps {
    data: PieChartDataEntry[];
    width?: number;
    height?: number;
    minHeight?: number;
    colors?: Color[];
    defaultColor?: Color;
    hasLabel?: boolean
    hasLegend?: boolean
    outerRadius?: number
    innerRadius?: number
    activeIndex?: number
    activeShape?: ActiveShape<PieSectorDataItem>
    onMouseEnter?: (_: unknown, index: number) => void
    labelling?: boolean
    startAngle?: number
    endAngle?: number
}

export interface BarChartProps <T>{
    data: T[],
    dataKey?: [keyof T],
    legend?: keyof T,
    color?: string
    showLegend?: boolean
    showCartesian?: boolean
    margins?: Margin
    width?: number
    height?: number
    minHeight?: number
    isPercent?: boolean
    stackId?: string
    stackBars?: number
    stackKeys?: Array<keyof T>
}
