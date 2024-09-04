import {Cell, Pie, PieChart, ResponsiveContainer} from "recharts";
import {PieProps} from "../../utils/interfaces.ts";

const AnglePieChart = ({colors}: PieProps) => {
    const data = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
    ];

    const COLORS = colors ? colors : ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return(
        <ResponsiveContainer width="100%" height="100%" minHeight={320}>
            <PieChart width={600} height={600}>
                <Pie
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                >
                    {data.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    )
}

export default AnglePieChart