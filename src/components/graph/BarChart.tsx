import { BarChart as ReChardBarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {BarChartProps} from "../ui/ui_interfaces.ts";
import {COLOR} from "../../utils/utils.ts";

export const BarChart = <T extends object>({
   data, dataKey, legend, color, showLegend, showCartesian, margins, width, height, minHeight, isPercent
}: BarChartProps<T>) => {

    const keys = dataKey

    const  setColor: (index: number) => string = (index: number): string => {
        if (color && index < 1) {
            return color
        }
        return COLOR[index]
    }

    return (
        <ResponsiveContainer width="100%" height="100%" minHeight={minHeight ?? 400}>
            <ReChardBarChart
                width={width ?? 500}
                height={height ?? 300}
                data={data}
                margin={margins ?? {
                    top: 20,
                    right: 20,
                    left: 10,
                    bottom: 20,
                }}>
                {showCartesian && <CartesianGrid strokeDasharray="3 3" />}
                <XAxis dataKey={legend as string} />
                <YAxis tickFormatter={isPercent ? (value) => value + '%' : undefined} />
                <Tooltip />
                {showLegend && <Legend />}
                {keys.map((key, index) => (
                    <Bar dataKey={key as string} key={index} fill={setColor(index)} activeBar={
                        <Rectangle fill={setColor(index)} stroke={setColor(index)} />
                    } />
                ))}
            </ReChardBarChart>
        </ResponsiveContainer>
    )
}