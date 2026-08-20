import {ChartProps, BarProps} from "@/components/ui/ui_interfaces.ts";
import {BarChart} from "@/components/graph/BarChart.tsx";
import {useMemo} from "react";

export type StackedBarChartProps<TData> = ChartProps<TData> & BarProps<TData>

export const StackedBarChart = <TData extends object>(
    {data, dataKey, stackId, stackBars, stackKeys, ...rest}: StackedBarChartProps<TData>
) => {

    const resolvedKeys = useMemo<string[]>(() => {
        if (dataKey && dataKey.length > 0) return dataKey.map(String)
        return Array.from({length: stackBars || 0}).map((_, index) =>
            stackKeys ? String(stackKeys[index]) : `bar${index}`
        )
    }, [dataKey, stackKeys, stackBars])

    const normalizedData = useMemo(() => {
        return data.map((row) => {
            const total = resolvedKeys.reduce((sum, k) => sum + (Number((row as Record<string, unknown>)[k]) || 0), 0)
            const next: Record<string, unknown> = {...row} as Record<string, unknown>
            resolvedKeys.forEach((k) => {
                const raw = Number((row as Record<string, unknown>)[k]) || 0
                next[k] = total > 0 ? Math.round((raw / total) * 100) : 0
            })
            return next
        }) as TData[]
    }, [data, resolvedKeys])

    return(
        <BarChart<TData>
            {...rest}
            data={normalizedData}
            dataKey={dataKey}
            stackKeys={stackKeys}
            stackBars={stackBars}
            stackId={stackId ?? "stack"}
            isPercent={true}
        />
    )
}