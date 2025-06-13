import {
    BarChart as ReChardBarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {BarProps, ChartProps} from "../ui/ui_interfaces.ts";
import {setGraphColor} from "../../core/utils/utils.ts";

type BarChartProps<TData> = ChartProps<TData> & BarProps<TData>

export const BarChart = <T extends object>({
   data, dataKey, legend, color, layout, showLegend, showCartesian, margins, width, height, minHeight, isPercent, stackId, stackBars,
   stackKeys, barSize, showYAxis = true, showXAxis = true
}: BarChartProps<T>) => {

    const keys = dataKey

    const setColor = (index: number) => {
        return setGraphColor(color as string, index)
    }

    return (
        <ResponsiveContainer width={width || '100%'} height={height || (minHeight || 300)} minHeight={300}>
            <ReChardBarChart
                data={data}
                barSize={barSize}
                layout={layout}
                margin={margins || {
                    top: 20,
                    right: 20,
                    left: 10,
                    bottom: 20,
                }}>
                {showCartesian && <CartesianGrid strokeDasharray="3 3" />}
                {layout === 'vertical'
                    ? (showXAxis ? <XAxis type="number" tickFormatter={isPercent ? (value) => value + '%' : undefined} /> : null)
                    : (<XAxis dataKey={legend as string} />)
                }
                {layout === 'vertical'
                    ? (<YAxis dataKey={legend as string} type="category" />)
                    : (showYAxis ? <YAxis tickFormatter={isPercent ? (value) => value + '%' : undefined} /> : null)
                }
                <Tooltip formatter={isPercent ? (value) => value + '%' : undefined} />
                {showLegend && <Legend />}
                {keys && keys?.length > 0
                    ? keys.map((key, index) => (
                        <Bar
                            barSize={barSize ?? 50}
                            dataKey={key as string}
                            key={`bar-${index}-${String(key)}`}
                            stackId={stackId}
                            fill={setColor(index)}
                            activeBar={
                                <Rectangle fill={setColor(index)} stroke={setColor(index)} />
                            }
                        />
                    ))
                    : Array.from({ length: stackBars || 0 }).map((_, index) => {
                        const skey = stackKeys ? stackKeys[index] as string : `bar${index}`;
                        return (<Bar
                            barSize={barSize ?? 50}
                            key={`bar-${index}-${skey}`}
                            dataKey={stackKeys ? stackKeys[index] as string : `bar${index}`}
                            stackId={stackId}
                            fill={setColor(index)}
                            activeBar={
                                <Rectangle fill={setColor(index)} stroke={setColor(index)} />
                            }
                        />)
                    })}
            </ReChardBarChart>
        </ResponsiveContainer>
    )
}
