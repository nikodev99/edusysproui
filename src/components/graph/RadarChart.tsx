import { Radar } from '@ant-design/plots';

interface RadarProps {
    data: object[]
    xField: string,
    yField: string
    config?: object
}

const RadarChart = ({data, xField, yField}: RadarProps) => {

    const config = {
        data: data,
        xField: xField,
        yField: yField,
        meta: {
          score: {
              min: 0,
              max: 20,
              tickInterval: 20
          }
        },
        area: {
            style: {
                fillOpacity: 0.2,
            },
        },
        scale: {
            x: {
                padding: 0.5,
                align: 0,
            },
            y: {
                nice: true,
            },
        },
        axis: {
            x: {
                title: false,
                grid: true,
            },
            y: {
                gridAreaFill: 'rgba(0, 0, 0, 0.04)',
                label: true,
                title: false,
            },
        }
    };

    return(
        <Radar {...config} />
    )
}

export default RadarChart