import {ReactNode, useEffect, useState} from "react";
import {Score, Student} from "../../entity";
import {useRawFetch} from "../../hooks/useFetch.ts";
import {Statistic, TableColumnsType} from "antd";
import {AvatarTitle} from "../ui/layout/AvatarTitle.tsx";
import {firstWord} from "../../core/utils/utils.ts";
import {AiOutlineArrowUp} from "react-icons/ai";
import {Table} from "../ui/layout/Table.tsx";
import VoidData from "../view/VoidData.tsx";
import {Color} from "../../core/utils/interfaces.ts";
import {AxiosResponse} from "axios";
import {text} from "../../core/utils/text_display.ts";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface BestProps {
    fetchFunc?: (...args: any[]) => Promise<AxiosResponse<Score, any>>;
    funcParams?: any[]
    providedData?: Score[]
    color?: Color
    icon?: ReactNode
    goodToPoor?: boolean
}

export const BestScoredTable = (
    {fetchFunc, funcParams = [], providedData, color, goodToPoor = false, icon}: BestProps
) => {
    const [scores, setScores] = useState<Score[] | null>(null)
    const fetch = useRawFetch<Score>();

    useEffect(() => {
        if (fetchFunc) {
            fetch(fetchFunc, funcParams)
                .then(resp => {
                    if(resp.isSuccess) {
                        setScores(resp?.data as Score[])
                    }
                })
        }
        
        if (providedData) {
            setScores(providedData)
        }
        
    }, [fetch, fetchFunc, funcParams, providedData]);

    const columns: TableColumnsType<Score> = [
        {
            title: 'Nom, Prénom',
            dataIndex: 'student',
            key: 'student',
            width: '80%',
            render: (value: Student) => <AvatarTitle
                lastName={firstWord(value?.personalInfo?.lastName)}
                firstName={firstWord(value?.personalInfo?.firstName)}
                image={firstWord(value?.personalInfo?.image)}
                size={35}
                link={text.student.group.view.href + value.id}
            />
        },
        {
            dataIndex: 'obtainedMark',
            key: 'obtainedMark',
            width: '20%',
            render: text => <Statistic
                value={text} precision={0} prefix={icon ?? <AiOutlineArrowUp />}
                valueStyle={{color: goodToPoor ? '#cf1322' : '#10b915', fontSize: '16px'}}
            />
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
                    pagination: false
                }}
                color={color}
            /> : <VoidData />}
        </>
    )
}