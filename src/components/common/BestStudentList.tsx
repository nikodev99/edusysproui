import PanelSection from "@/components/ui/layout/PanelSection.tsx";
import PanelTable from "@/components/ui/layout/PanelTable.tsx";
import {BestScoredTable} from "@/components/common/BestScoredTable.tsx";
import {AiOutlineArrowDown} from "react-icons/ai";
import Section from "@/components/ui/layout/Section.tsx";
import {ClasseRanking, GradeRankingStudent} from "@/entity";
import {ReactNode, useCallback} from "react";
import {text} from "@/core/utils/text_display.ts";

type GradeRankingFunction = (record: GradeRankingStudent) => ReactNode
type ClasseRankingFunction = (record: ClasseRanking) => ReactNode

type DataProp<TData extends object> = {
    bestStudents: TData
}

type Props = {
    hasPermission?: boolean
    sectionTitles: {
        sectionTitle: GradeRankingFunction | ClasseRankingFunction | ReactNode
        bestTableTitle: string, 
        poorTableTitle: string
    }
    color?: string
}

export const BestStudentList = ({sectionTitles, color, hasPermission, bestStudents}: Props & DataProp<GradeRankingStudent[] | ClasseRanking[]>) => {

    return (
        <>
            {bestStudents && bestStudents.length > 0 ? bestStudents.map((s: GradeRankingStudent | ClasseRanking, i: number) => (
                <SingleBestStudentList
                    sectionTitles={sectionTitles}
                    color={color}
                    key={`${s.section}-${i}`}
                    hasPermission={hasPermission} 
                    bestStudents={s as GradeRankingStudent | ClasseRanking}
                />
            )): (
                <Section title={`Performance des ${text.student.label}`}>
                    <BestScoredTable
                        providedData={[]}
                        color={color}
                        markAsAbsent={false}
                        hasPermission={hasPermission}
                    />
                </Section>
            )}
        </>
    )
}

export const SingleBestStudentList = ({sectionTitles, color, hasPermission, bestStudents}: Props & DataProp<GradeRankingStudent | ClasseRanking>) => {

    const getTitle = useCallback((record: GradeRankingStudent | ClasseRanking): ReactNode => {
        if(typeof sectionTitles.sectionTitle === 'function') {
            return sectionTitles.sectionTitle(record as never)
        }
        return sectionTitles.sectionTitle ?? ''
    }, [sectionTitles])

    return (
        <>
            {bestStudents ? (
                <PanelSection
                    title={getTitle(bestStudents as GradeRankingStudent)}
                    style={{marginBottom: '10px'}}
                >
                    <PanelTable title={sectionTitles.bestTableTitle} panelColor={color} data={[{
                        tableRow: true,
                        response: <BestScoredTable
                            providedData={bestStudents.bestStudentScores}
                            color={color}
                            markAsAbsent={false}
                            hasPermission={hasPermission}
                        />
                    }]} />
                    <PanelTable title={sectionTitles.poorTableTitle} panelColor={color} data={[{
                        tableRow: true,
                        response: <BestScoredTable
                            providedData={bestStudents.poorStudentScores}
                            color={color}
                            icon={<AiOutlineArrowDown />}
                            hasPermission={hasPermission}
                            goodToPoor
                        />
                    }]} />
                </PanelSection>
            ) : (
                <Section title={`Performance des ${text.student.label}`}>
                    <BestScoredTable
                        providedData={[]}
                        color={color}
                        markAsAbsent={false}
                        hasPermission={hasPermission}
                    />
                </Section>
            )}
        </>
    )
}