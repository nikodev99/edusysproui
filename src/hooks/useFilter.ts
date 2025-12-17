import {useCallback} from "react";
import {Options} from "../core/utils/interfaces.ts";

export type FilterType<T extends object> = {
    setFilters: (filters: T) => void,
    academicYear?: string,
    academicYearOptions?: Options
    academicYearChangeFunc?: (value: string) => void
}

export const useFilter = <T extends object>(setItems: (filters: T) => void, setFilters: (filters: T) => void) => {
    const getOptions = <T extends object>(data: T[], value: keyof T, label: keyof T): Options => {
        const mappedData = data?.map(d => ({
            value: d[value] as unknown as string,
            label: d[label] as string,
        })) || [];

        return [{value: 0, label: 'TOUS'}, ...mappedData];
    }

    const makeOnChange =
        (key: keyof T) =>
            (value: unknown) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                setItems((prev: never): NonNullable<unknown> => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    const next = { ...prev, [key]: value as number };
                    setFilters(next);
                    return next;
                });
            };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const handleUpdateFilters = (key: keyof T) => setItems((prev: never) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const next = { ...prev, [key]: 0 };
        setFilters(next);
        return next;
    })

    const handleClear = useCallback(
        (key: keyof T) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setItems((prev: { [x: string]: never; }) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [key]: _, ...rest } = prev;
                const next = rest as T;
                setFilters(next);
                return next;
            });
        },
        [setFilters]
    );
    
    return {
        getOptions,
        makeOnChange,
        handleUpdateFilters,
        handleClear
    }
}