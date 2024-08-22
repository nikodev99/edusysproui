import {Pie} from "@ant-design/plots";

interface PieProps {
    data: {type: string, value: number}[];
    label?: (obj: object) => string;
}

const PieChart = ({data, label}: PieProps) => {

    const config = {
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.6,
        label: {
            text: label,
            position: 'spider',
        },
        legend: {
            color: {
                title: false,
                position: 'bottom',
                rowPadding: 5,
            },
        },
    };

    return <Pie {...config} />;
}

export default PieChart;