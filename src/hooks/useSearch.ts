import {useCallback, useRef, useState} from "react";
import {useRawFetch} from "./useFetch.ts";
import {AxiosResponse} from "axios";
import {ResponseRepo} from '../data/action/responseRepo.ts'
import {Options} from "../core/utils/interfaces.ts";

export const useSearch = <T extends object>(
    {setValue, funcParams = [], fetchFunc, setCustomOptions}: {
        setValue: (value: unknown) => void
        fetchFunc: (...args: unknown[]) => Promise<AxiosResponse<T, unknown>> | Promise<ResponseRepo<T>>
        funcParams?: unknown[]
        setCustomOptions: (options?: T[]) => Options
    }) => {
    const [options, setOptions] = useState<Options>([]);
    const [selectedValue, setSelectedValue] = useState<unknown>('');
    const [resource, setResource] = useState<T | undefined>(undefined)
    const [records, setRecords] = useState<T[] | undefined>(undefined)
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const currentValue = useRef<unknown>('');
    const [fetching, setFetching] = useState(false);
    const rawFetch = useRawFetch()

    // Memoize the fetch function to prevent unnecessary re-renders
    const fetch = useCallback((value: unknown, callback: (data: Options) => void) => {

        // Clear any existing timeout
        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
        }

        // Update current value reference
        currentValue.current = value;

        const performSearch = async () => {
            setFetching(true);

            try {
                // Call the rawFetch with proper parameters
                const response = await rawFetch(
                    fetchFunc as (...args: unknown[]) => Promise<AxiosResponse<T, unknown>>,
                    [value, ...funcParams]
                );

                if (response && 'data' in response) {
                    const returnRecords: T[] = response.data as T[];

                    // Only update if this is still the current search
                    if (currentValue.current === value) {
                        const transformedData = setCustomOptions(returnRecords);
                        setRecords(returnRecords)

                        callback(transformedData as []);
                    } else {
                        console.log('Search value changed, ignoring stale response');
                    }
                } else {
                    if (!selectedValue) {
                        callback([]);
                    }
                }
            } catch (error) {
                if (!selectedValue) {
                    callback([]);
                }
            } finally {
                setFetching(false);
            }
        };

        // Debounce the search
        if (value) {
            timeout.current = setTimeout(performSearch, 300);
        } else {
            if(!selectedValue) {
                callback([]);
            }
            
            setFetching(false);
        }
    }, [fetchFunc, funcParams, rawFetch, selectedValue, setCustomOptions]);

    const handleSearch = useCallback((newValue: unknown) => {
        if (newValue !== selectedValue)
            fetch(newValue, setOptions);
    }, [fetch, selectedValue]);

    const handleChange = useCallback((newValue: unknown) => {
        setSelectedValue(newValue);
        
        if (records) {
            setResource(records.find(i => i['id'] === newValue))
        }
        
        setValue(newValue);

        if (options?.length === 0) {
            // If options are empty, but we have a selected value, 
            // we might want to trigger a search to repopulate
            const selectedOption = options.find(opt => opt.value === newValue);
            if (selectedOption) {
                setOptions([selectedOption]); // At minimum, keep the selected option
            }
        }
    }, [options, records, setValue]);

    // Clear function for resetting the search
    const clearSearch = useCallback(() => {
        setOptions([]);
        setSelectedValue('');
        setResource(undefined)
        currentValue.current = '';
        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
        }
    }, []);

    return {
        options,
        setOptions,
        timeout,
        currentValue,
        fetching,
        fetch,
        handleSearch,
        handleChange,
        setValue,
        clearSearch, // New utility function
        resource,
        selectedValue,
    }
}