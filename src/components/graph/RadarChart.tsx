import {
    ResponsiveContainer,
    RadarChart as ReChartRadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Tooltip
} from "recharts";

interface RadarProps {
    data: object[]
    xField: string
    yField: string
    config?: object
    color?: string
    width?: number
    height?: number
    maxValue?: number
}

interface AngleTickProps {
    x: number
    y: number
    textAnchor: 'start' | 'middle' | 'end'
    payload: { value: string }
}

interface CustomTooltipProps {
    active?: boolean
    payload?: { value: number }[]
    label?: string
}

const MAX_CHARS_PER_LINE = 10
const MAX_LINES = 3
const LINE_HEIGHT = 12

function wrapLabel(text: string): string[] {
    const words = text.split(' ')
    const lines: string[] = []
    let current = ''

    for (const word of words) {
        const next = current ? `${current} ${word}` : word
        if (next.length > MAX_CHARS_PER_LINE && current) {
            lines.push(current)
            current = word
        } else {
            current = next
        }
    }
    if (current) lines.push(current)

    if (lines.length <= MAX_LINES) return lines

    const visible = lines.slice(0, MAX_LINES)
    visible[MAX_LINES - 1] = `${visible[MAX_LINES - 1]}…`
    return visible
}

const AngleTick = ({x, y, textAnchor, payload}: AngleTickProps) => {
    const lines = wrapLabel(payload.value)
    const dx = textAnchor === 'start' ? 6 : textAnchor === 'end' ? -6 : 0
    const startDy = -((lines.length - 1) * LINE_HEIGHT) / 2

    return (
        <text x={x + dx} y={y} textAnchor={textAnchor} fontSize={11} fill="#666">
            {lines.map((line, i) => (
                <tspan key={i} x={x + dx} dy={i === 0 ? startDy : LINE_HEIGHT}>
                    {line}
                </tspan>
            ))}
        </text>
    )
}

const RadarChart = ({data, xField, yField, color, width, height, maxValue = 20}: RadarProps) => {

    const COLOR = color ? color : '#8884d8'

    const renderTooltip = ({active, payload, label}: CustomTooltipProps) => {
        if (!active || !payload || !payload.length) return null

        return (
            <div style={{
                background: '#fff',
                border: '0.5px solid #ddd',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 13,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <p style={{margin: 0, fontWeight: 500}}>{label}</p>
                <p style={{margin: 0, color: '#666'}}>
                    {yField}: {payload[0].value}{maxValue ? ` / ${maxValue}` : ''}
                </p>
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={width || 350} maxHeight={height || 400}>
            <ReChartRadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey={xField} tick={props => <AngleTick {...props} />} />
                <PolarRadiusAxis domain={[0, maxValue || 'auto']} />
                <Tooltip content={renderTooltip as never} />
                <Radar dataKey={yField} stroke={COLOR} fill={COLOR} fillOpacity={0.6} />
            </ReChartRadarChart>
        </ResponsiveContainer>
    )
}

export default RadarChart