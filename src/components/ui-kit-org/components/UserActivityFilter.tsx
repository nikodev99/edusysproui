import {Filter} from "../../common/Filter.tsx";
import {ActivityFilterProps} from "../../../data/repository/userRepository.ts";
import {useCallback, useState} from "react";
import {DatePicker} from "antd";
import Datetime from "../../../core/datetime.ts";
import {ItemType} from "antd/es/menu/interface";
import {Dayjs} from "dayjs";

type UserActivityFilterProps = {
    setFilters: (filters: ActivityFilterProps) => void
}

export const UserActivityFilter = ({setFilters}: UserActivityFilterProps) => {
    const [filterItem, setFilterItem] = useState<ActivityFilterProps>({
        dates: {
            startDate: Datetime.now().minusMonth(1).toDate(),
            endDate: Datetime.now().toDate()
        }
    } as ActivityFilterProps)

    const {RangePicker} = DatePicker

    const handleDateRangeChange = (value: [Dayjs, Dayjs]) => {
        const [start, end] = value
        setFilterItem(prev => {
            const next = {
                ...prev,
                dates: {
                    startDate: start ? Datetime.of(start).toDate() : undefined,
                    endDate: end ? Datetime.of(end).toDate() : undefined
                }
            } as ActivityFilterProps
            setFilters(next)
            return next
        })
    }

    const handleUpdateFilters = (key: keyof ActivityFilterProps) => setFilterItem((prev) => {
        const next = { ...prev, [key]: 0 };
        setFilters(next);
        return next;
    })

    const items: ItemType[] = [
        {key: '2', label: "Dates d'activité", onClick: () => handleUpdateFilters('dates')},
    ]

    const handleClear = useCallback(
        (key: keyof ActivityFilterProps) => {
            setFilterItem((prev) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [key]: _, ...rest } = prev;
                const next = rest as ActivityFilterProps;
                setFilters(next);
                return next;
            });
        },
        [setFilters]
    );

    return(
        <Filter
            filters={filterItem}
            items={items}
            onClear={handleClear}
            inputRender={{
                dates: ({onClear}) =>
                    <RangePicker
                        format={"DD/MM/YYYY"}
                        onChange={(dates) => {
                            if (!dates) {
                                onClear()
                            } else {
                                handleDateRangeChange(dates as never)
                            }
                        }}
                        style={{ width: 250 }}
                    />
        }} />
    )
}