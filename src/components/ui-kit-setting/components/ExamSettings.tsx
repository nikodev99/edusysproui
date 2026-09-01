import Grid from "@/components/ui/layout/Grid.tsx";
import PageWrapper from "@/components/view/PageWrapper.tsx";
import {SettingCard} from "@/components/ui-kit-setting";
import {Button, Input, InputNumber, Select, Space, Typography} from "antd";
import {LuCheck, LuSave} from "react-icons/lu";
import {getSetting, ScoreMode, SettingProps, SettingTitle} from "@/entity";
import Responsive from "@/components/ui/layout/Responsive.tsx";
import {memo, useCallback, useEffect, useMemo, useState} from "react";
import {text} from "@/core/utils/text_display.ts";
import {useSettingStore} from "@/core/global/settingStore.ts";
import {useGradeRepo} from "@/hooks/actions/useGradeRepo.ts";
import {enumToObjectArray, getUniqueness} from "@/core/utils/utils.ts";
import {stringhelper} from "@/core/helpers/StringHelper.ts";
import {GradeConfig, MarkType} from "@/entity/enums/MarkType.ts";

export const ExamSettings = memo(({settings, getMessages}: SettingProps) => {
    const initNames = getSetting<string>(settings?.examnames as string, text.exam.label)
    const initAppreciations = getSetting<GradeConfig[]>(settings?.gradingappreciationlabels, [])
    const [examNames, setExamNames] = useState<string>(initNames)
    const [data, setData] = useState<GradeConfig[]>(initAppreciations)

    console.log({settings})

    const [isSaving, setIsSaving] = useState<Partial<{
        names: boolean,
        mode: boolean
    }>>({
        names: false,
        mode: false,
    })
    const disabled = stringhelper.changeCase(examNames, { compareWith: initNames })

    const { Text } = Typography

    const update = useSettingStore(s => s.updateSetting)

    const {allGrades} = useGradeRepo()
    const gradeExpected = useMemo(() => getUniqueness(allGrades, g => g.gradingScaleMax, i => i), [allGrades])
    const scoreTypeOptions = useMemo(() => enumToObjectArray(ScoreMode, true), [])
    const markTypeOptions =useMemo(() => enumToObjectArray(MarkType, true), [])

    const buildInitialConfigs = useCallback((): GradeConfig[] =>
        gradeExpected?.map(max => ({
            maxValue: max,
            markLabels: markTypeOptions.map((_, i) => ({ key: i, avg: 0, label: '' })),
        } as GradeConfig)) || [], [markTypeOptions, gradeExpected]);

    useEffect(() => {
        if (initAppreciations) return

        setData(buildInitialConfigs());
    }, [buildInitialConfigs, initAppreciations]);

    const handleUpdateExamNames = async () => {
        if (disabled) return
        setIsSaving({names: true})
        try {
            await update(SettingTitle.EXAM_NAMES, examNames)
        }catch (err) {
            setExamNames(settings?.examnames as string || text.exam.label)
        }finally {
            setIsSaving({names: false})
        }
    }

    const handleUpdateMode = async (value: ScoreMode) => {
        if (disabled) return
        setIsSaving({mode: true})
        try {
            await update(SettingTitle.GRADING_MODE, value)
        }catch (err) {
            getMessages?.({error: err instanceof Error ? err.message : 'Erreur inconnue'})
        }finally {
            setIsSaving({mode: false})
        }
    }

    const updateAvg = (maxIndex: number, rowIndex: number, value: number | null) => {
        setData(prev =>
            prev?.map((cfg, mi) =>
                mi !== maxIndex
                    ? cfg
                    : {
                        ...cfg,
                        markLabels: cfg.markLabels.map((ml, ri) =>
                            ri !== rowIndex ? ml : { ...ml, avg: value ?? 0 }
                        ),
                    }
            )
        );
    };

    const updateLabel = (maxIndex: number, rowIndex: number, value: string) => {
        setData(prev =>
            prev?.map((cfg, mi) =>
                mi !== maxIndex
                    ? cfg
                    : {
                        ...cfg,
                        markLabels: cfg.markLabels.map((ml, ri) =>
                            ri !== rowIndex ? ml : { ...ml, label: value }
                        ),
                    }
            )
        );
    };

    console.log({data})

    const handleSubmit = async () => {
        await update(SettingTitle.GRADING_APPRECIATION_LABELS, data as [])
    }

    return(
        <Responsive gutter={[16, 16]} justify='center'>
            <Grid xs={24} md={12} lg={12} xxl={12}>
                <PageWrapper styles={{display: 'flex', flexDirection: 'column', gap: 10}}>
                    {/* Change the exam label */}
                    <SettingCard title='Appellation des apprénants'>
                        <Space.Compact>
                            <Input
                                value={examNames}
                                size='small' variant='filled'
                                onChange={(e) => setExamNames(e.target.value)}
                            />
                            <Button
                                type='primary'
                                icon={<LuSave />}
                                onClick={handleUpdateExamNames}
                                loading={isSaving.names}
                                disabled={Boolean(disabled)}
                            />
                        </Space.Compact>
                    </SettingCard>

                    {/* Determiné le mode de notation et note maximal */}
                    <SettingCard
                        title='Mode de notation'
                        description={'Définissez le système d\'évaluation appliqué par défaut dans l\'établissement.'}>
                            <Select
                                defaultValue={'DIGITS' as ScoreMode}
                                variant='filled' size='small'
                                options={scoreTypeOptions}
                                loading={isSaving.mode}
                                disabled onChange={handleUpdateMode}
                            />
                    </SettingCard>

                    {/* Change les appréciations */}
                    <SettingCard title={'Appréciations automatiques par tranche'}>
                        {(data && data.length >0) && data.map((cfg, maxIndex) => (
                            <div key={cfg.maxValue} style={{marginBottom: 10}}>
                                <h4>Note maximal: {cfg.maxValue}</h4>
                                <Text>Mentions figurant sur les bulletins selon la moyenne finale obtenue. (inférieur ou égal)</Text>
                                {cfg.markLabels?.map((ml, rowIndex) => (
                                    <div key={`${ml.key}-${rowIndex}`} style={{display: 'flex', gap: 6, alignItems: 'center', justifyItems: 'start', marginBottom: 10}}>
                                        <InputNumber
                                            size="small"
                                            value={ml.avg}
                                            min={0}
                                            max={cfg.maxValue}
                                            onChange={(value) => updateAvg(maxIndex, rowIndex, value)}
                                        />
                                        <Select
                                            size="small"
                                            options={markTypeOptions}
                                            value={ml.label}
                                            onChange={(value) => updateLabel(maxIndex, rowIndex, value)}
                                            style={{ minWidth: 120 }}
                                        />
                                        <LuCheck />
                                    </div>
                                ))}
                            </div>
                        ))}
                        <Button icon={<LuSave />} type='primary' onClick={handleSubmit} />
                    </SettingCard>
                </PageWrapper>
            </Grid>
        </Responsive>
    )
})