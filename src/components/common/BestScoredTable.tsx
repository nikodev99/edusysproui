import {ReactNode, useEffect, useState} from "react";
import {Score, Student} from "@/entity";
import {useRawFetch} from "@/hooks/useFetch.ts";
import {Statistic, TableColumnsType} from "antd";
import {AvatarTitle} from "../ui/layout/AvatarTitle.tsx";
import {firstWord} from "@/core/utils/utils.ts";
import {AiOutlineArrowDown, AiOutlineArrowUp} from "react-icons/ai";
import {Table} from "../ui/layout/Table.tsx";
import VoidData from "../view/VoidData.tsx";
import {Color} from "@/core/utils/interfaces.ts";
import {AxiosResponse} from "axios";
import Tag from "../ui/layout/Tag.tsx";
import {stringhelper} from "@/core/helpers/StringHelper.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";

interface BestProps {
    fetchFunc?: (...args: unknown[]) => Promise<AxiosResponse<Score, unknown>>;
    funcParams?: unknown[]
    providedData?: Score[]
    color?: Color
    icon?: ReactNode
    goodToPoor?: boolean
    markAsAbsent?: boolean
    isShrink?: boolean
    hasPermission?: boolean
}

export const BestScoredTable = (
    {fetchFunc, funcParams = [], providedData, color, goodToPoor = false, icon, markAsAbsent = true, isShrink = false, hasPermission = false}: BestProps
) => {
    const [scores, setScores] = useState<Score[] | null>(null)
    const {toViewStudent} = useRedirect()
    const fetch = useRawFetch<Score>();

    const isAbsent = (score: Score) => {
        return markAsAbsent ? score.isPresent : false
    }

    useEffect(() => {
        if (!fetchFunc) return

        let cancelled = false;

        if (fetchFunc) {
            fetch(fetchFunc, funcParams)
                .then(resp => {
                    if (cancelled) return
                    if(resp.isSuccess) {
                        setScores(resp?.data as Score[])
                    }
                })
        }

        return () => {
            cancelled = true;
        }

    }, [fetch, fetchFunc, funcParams]);

    useEffect(() => {
        if (providedData && providedData.length) {
            setScores(providedData)
        }
    }, [providedData]);

    const columns: TableColumnsType<Score> = [
        {
            title: 'Nom, Prénom',
            dataIndex: 'student',
            key: 'student',
            render: (value: Student) => <AvatarTitle
                lastName={firstWord(value?.personalInfo?.lastName)}
                firstName={firstWord(value?.personalInfo?.firstName)}
                reference={value?.personalInfo?.reference}
                image={firstWord(value?.personalInfo?.image)}
                size={35}
                toView={ hasPermission ? () =>toViewStudent(value?.id, value?.personalInfo): undefined }
            />
        },
        {
            dataIndex: 'obtainedMark',
            key: 'obtainedMark',
            align: 'end',
            render: (avg: number, record: Score) => {
                return <Statistic
                    value={isShrink ? stringhelper.formatAvg(record?.shrinkMark) : stringhelper.formatAvg(avg)}
                    prefix={isAbsent(record) ? <Tag color='danger'>Absent</Tag> : undefined}
                    suffix={icon ?? goodToPoor ? <AiOutlineArrowDown /> : <AiOutlineArrowUp />}
                    valueStyle={{color: goodToPoor ? '#cf1322' : '#10b915', fontSize: '16px'}}
                />
            }
        }
    ]

    return(
        <>
            {scores && scores?.length > 0 ? <Table
                tableProps={{
                    rowKey: score => `${score?.student?.id}`,
                    dataSource: scores?.sort((a, b) => b.obtainedMark - a.obtainedMark),
                    columns: columns as [],
                    size: 'small',
                    pagination: false,
                    bordered: true
                }}
                color={color}
            /> : <VoidData />}
        </>
    )
}