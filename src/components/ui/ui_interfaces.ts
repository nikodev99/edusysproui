import {ActiveShape, Margin} from "recharts/types/util/types";
import {Color} from "../../core/utils/interfaces.ts";
import {PieSectorDataItem} from "recharts/types/polar/Pie";
import {CurveType} from "recharts/types/shape/Curve";

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
    labelLine?: boolean
    startAngle?: number
    endAngle?: number
    isLoading?: boolean
}

export interface ChartProps<T>{
    data: T[],
    dataKey?: (keyof T)[],
    legend?: keyof T,
    color?: Color | Color[],
    showLegend?: boolean
    showCartesian?: boolean
    margins?: Margin
    width?: number
    height?: number
    minHeight?: number
    isPercent?: boolean
    layout?: 'horizontal' | 'vertical' | 'centric' | 'radial'
    eachBarColor?: boolean
}

export interface BarProps<T> {
    barSize?: number
    stackId?: string
    stackBars?: number
    stackKeys?: Array<keyof T>
}

export interface LineProps {
    type?: CurveType
}
