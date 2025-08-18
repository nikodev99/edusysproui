import {Avatar, Badge, Button, Card, Divider, Flex, Space, Timeline, Typography} from "antd";
import {AcademicYear, Grade, Planning} from "../../../entity";
import {AiOutlineBook, AiOutlineCalendar, AiOutlineClockCircle} from "react-icons/ai";
import Datetime from "../../../core/datetime.ts";
import {calculateDuration, COLOR, groupeBySemester, MAIN_COLOR} from "../../../core/utils/utils.ts";
import {useMemo} from "react";
import {LuCornerDownRight} from "react-icons/lu";
import Tag from "../../ui/layout/Tag.tsx";

interface GradeCardProps {
    data: Grade,
    academicYear?: AcademicYear,
    size?: 'small' | number,
    dataKey?: string | number,
    onlyPlanning?: boolean,
}

export const GradeCard = ({data, academicYear, size, dataKey, onlyPlanning = false}: GradeCardProps) => {
    const { Text } = Typography

    const timelineItems = useMemo(() => {
        const semesters = data && data?.planning ? groupeBySemester(data?.planning as Planning[]) : {}
        return Object.entries(semesters)
            ?.map(([semesterName, plan], index) => {
                const color = COLOR[index]

                const semesterHeaderItem = {
                    color,
                    children: (
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Badge color={color} style={{marginRight: '8px'}}/>
                            <h4 style={{margin: 0, color: color}}>
                                {semesterName}
                            </h4>
                        </div>
                    )
                }

                const sortedPlanning = plan?.slice()
                    ?.sort((a, b) => Datetime.of(a?.termStartDate as number[]).diffSecond(b?.termEndDate as number[]))

                const planItems = sortedPlanning?.map(p => ({
                    dot: <LuCornerDownRight style={{background: 'transparent', color: color}} />,
                    children: (
                        <div style={{marginBottom: '10px', border: '1px solid #0000c40'}}>
                            <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                                <h4 style={{margin: 0, color: color}}>
                                    {p?.designation}
                                </h4>
                            </div>

                            <Flex vertical>
                                {Datetime.of(p?.termStartDate as number[]).compare(p?.termEndDate as number[]) !== 0 ? (
                                    <Flex gap={5} style={{ marginBottom: '8px' }}>
                                        <Flex align='center' gap={10}>
                                            <AiOutlineCalendar />
                                            <Text strong>
                                                Du {Datetime.of(p?.termStartDate as number[]).format('DD/MM/YYYY')}
                                            </Text>
                                        </Flex>
                                        <Text strong>
                                            au {Datetime.of(p?.termEndDate as number[]).format('DD/MM/YYYY')}
                                        </Text>
                                    </Flex>
                                ) : (
                                    <Flex align='center' gap={10}>
                                        <AiOutlineCalendar />
                                        <Text strong>
                                            Le {Datetime.of(p?.termStartDate as number[]).format('DD/MM/YYYY')}
                                        </Text>
                                    </Flex>
                                )}
                            </Flex>
                            <Tag icon={<AiOutlineClockCircle />} color={color} textColor='#e6e7ed'>
                                {calculateDuration(p.termStartDate as number[], p.termEndDate as number[])}
                            </Tag>
                        </div>
                    )
                }))
                return [semesterHeaderItem, ...planItems]
            })
            ?.flat() || []
    }, [Text, data])

    return(
        <section key={dataKey}>
            <Card
                style={{
                    background: 'linear-gradient(135deg, #F0F4F8 0%, #FDF0E1 100%)',
                    border: 'none'
                }}
                styles={{
                    body: {padding: 0}
                }}
            >
                {/* Header Section */}
                {!onlyPlanning && <div style={{
                    padding: size && size == 'small' ? '12px' : size ? size : '24px',
                    borderRadius: '16px 16px 0 0'
                }}>
                    <Flex vertical>
                        <Flex align='center' gap={16} style={{marginBottom: size && size == 'small' ? '2px' : size ? `${size}px` :'10px'}}>
                            <Avatar size={64} style={{background: MAIN_COLOR}}><AiOutlineBook /></Avatar>
                            <Flex justify={'start'} align={'center'} vertical>
                                <h2 style={{ margin: 0, color: '#2c3e50' }}>{data.section}</h2>
                                <Text  italic>{data.subSection}</Text>
                            </Flex>
                        </Flex>
                        {academicYear && <Flex align='center' justify='space-between' gap={10}>
                            <Text type="secondary" style={{ display: 'block', fontSize: '16px' }}>
                                Année Académique: {academicYear?.academicYear}
                            </Text>
                            {academicYear && academicYear?.current && (
                                <Tag color='success'>
                                    Courante
                                </Tag>
                            )}
                        </Flex>}
                    </Flex>
                </div>}

                {/* Academic Year Overview */}
                <div style={{ padding: size && size == 'small' ? '12px' : size ? size : '24px', background: 'rgba(255, 255, 255, 0.9)' }}>
                    {(!onlyPlanning && academicYear) && <div style={{
                        background: 'linear-gradient(90deg, #32383E 0%, #492B08 100%)',
                        padding: size && size == 'small' ? '5px' : size ? size : '16px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                    }}>
                        <Flex align='center' style={{ color: '#fff', marginBottom: '8px' }}>
                            <AiOutlineCalendar style={{ marginRight: '8px' }} />
                            <h4>Période Académique Complète </h4>
                        </Flex>
                        <Text style={{ fontSize: '16px', color: '#fff' }}>
                            Du {Datetime.of(academicYear?.startDate as number[]).fDate()} au {Datetime.of(academicYear?.endDate as number[]).fDate()}
                        </Text>
                    </div>}

                    <Timeline
                        mode="left"
                        items={timelineItems}
                        style={{ padding: '0 20px' }}
                    />
                </div>

                {/* Footer with metadata */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    padding: size && size == 'small' ? '4px 12px' : size ? size :'16px 24px',
                    borderTop: '1px solid rgba(0, 0, 0, 0.06)'
                }}>
                    <Space split={<Divider type="vertical" />}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Créé le: {Datetime.of(data?.createdAt as number[]).fDate()}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Modifié le: {Datetime.of(data.modifyAt as number[]).fDate()}
                        </Text>
                        {academicYear && <Text type="secondary" style={{ fontSize: '12px' }}>
                            <Button type='primary' size="small">Modifier</Button>
                        </Text>}
                    </Space>
                </div>
            </Card>
        </section>
    )
}