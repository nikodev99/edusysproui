import {
    ResponsiveContainer,
    RadarChart as ReChartRadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from "recharts";

interface RadarProps {
    data: object[]
    xField: string,
    yField: string
    config?: object
    color?: string
    width?: number
    height?: number
}

const RadarChart = ({data, xField, yField, color, width, height}: RadarProps) => {

    const COLOR = color ? color : '#8884d8'

    return (
        <ResponsiveContainer width="100%" height={width ?? 350} maxHeight={height ?? 400}>
            <ReChartRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey={xField} />
                <PolarRadiusAxis />
                <Radar dataKey={yField} stroke={COLOR} fill={COLOR} fillOpacity={0.6} />
            </ReChartRadarChart>
        </ResponsiveContainer>
    )
}

export default RadarChart