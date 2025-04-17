import {useEffect, useState} from "react";
import {Score} from "../../entity";
import {Skeleton} from "antd";
import {BarChart} from "../graph/BarChart.tsx";
import {Color} from "../../core/utils/interfaces.ts";

type HistogramProps = {
    scores: Score[]
    isLoading: boolean
    color: Color
}

export const MarksHistogram = ({scores, isLoading, color}: HistogramProps) => {
    const [marks, setMarks] = useState<number[]>([])

    useEffect(() => {
        if (scores) {
            const newMarks = scores?.map((s: Score) => s.obtainedMark)
            setMarks(newMarks)
        }
    }, [scores]);

    if (marks.length === 0) {
        setMarks([10, 6, 8, 16, 8,5,3,1, 0,9, 19, 13, 16, 15, 20,9, 20,10, 10, 8, 12, 13, 12, 10, 7, 10, 11, 14, 15,12, 17])
    }

    const filter = (min: number, max: number) => {
        const count = marks.filter((mark, index) =>
            index === 0 ? mark >= min && mark <= max : mark > min && mark <= max
        ).length;
        return Math.round(((count / marks.length) * 100))
    }

    const histogramData = [
        { range: "0-5", pourcentage: filter(0, 5) },
        { range: "6-10", pourcentage: filter(5, 10) },
        { range: "11-15", pourcentage: filter(10, 15) },
        { range: "16-20", pourcentage: filter(15, 20) },
    ];

    return(
        <>
            {isLoading && <Skeleton active={isLoading} />}
            <BarChart
                data={histogramData}
                dataKey={['pourcentage']}
                legend='range'
                color={color}
                minHeight={350}
                isPercent
            />
        </>
    )
}