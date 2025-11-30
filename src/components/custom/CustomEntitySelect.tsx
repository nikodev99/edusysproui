import {SelectEntity} from "../../core/utils/interfaces.ts";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Select} from "antd";
import {useToggle} from "../../hooks/useToggle.ts";

export const CustomEntitySelect = <TEntity extends object, TEntityID extends string | number | number[]>(
    {
        data, getEntity, uniqueValue, options: {id, label}, width = '200px', getResource,
        entities, onlyCurrent, variant = 'borderless', placeholder, isLoading, multiple,
    }: SelectEntity<TEntity, TEntityID>
) => {
    const [activeResource, setActiveResource] = useState<TEntity | TEntity[]>()
    const [activeEntity, setActiveEntity] = useState<TEntityID | TEntityID[]>()
    const [hasUserInteracted, setHasUserInteracted] = useToggle(false)

    /**
     * A memoized variable that computes a list of entities based on certain conditions.
     *
     * The variable is derived using the `useMemo` hook to optimize performance by recomputing
     * only when dependencies change. It first determines the base list as `entities` if it exists
     * and has a length greater than zero; otherwise, it falls back to `data`.
     * Additionally, if `onlyCurrent` and `uniqueValue.key` are defined, the returned list is filtered
     * by the specified key in `uniqueValue` to match the value of `onlyCurrent`.
     *
     * Dependencies:
     * - `data`
     * - `entities`
     * - `onlyCurrent`
     * - `uniqueValue?.key`
     *
     * Returns:
     * The filtered or unfiltered list of entities based on the applied conditions.
     */
    const allEntities = useMemo(() => {
        let base = entities && entities.length > 0 ? entities : data;
        if (onlyCurrent && uniqueValue?.key) {
            const key = uniqueValue.key;

            base = base.filter(a => a[key] === onlyCurrent);
        }
        return base;
    }, [data, entities, onlyCurrent, uniqueValue?.key]);

    const getActiveEntity = useCallback(() => {
        if (hasUserInteracted || !uniqueValue || !uniqueValue.key || !uniqueValue?.value) {
            return;
        }

        if (Array.isArray(uniqueValue?.value)) {
            const activeEntities = allEntities
                .filter(a => (uniqueValue?.value as string[])
                .includes(a[uniqueValue.key as keyof TEntity] as never))
                
            setActiveEntity(activeEntities.map(entity => entity[id]) as TEntityID[]);
            if(getResource) {
                setActiveResource(activeEntities)
            }

        }else {
            const entity = allEntities.find(a => a[uniqueValue.key as keyof TEntity] === uniqueValue.value)
            setActiveEntity(entity?.[id] as TEntityID)
            if (getResource) {
                setActiveResource(entity)
            }
        }
    }, [allEntities, getResource, hasUserInteracted, id, uniqueValue])

    const setDefaultValue = useCallback(() => {
        if (activeEntity && !hasUserInteracted) {
            getEntity(activeEntity)
            if(getResource) {
                getResource(activeResource as TEntity)
            }
        }
    }, [activeEntity, activeResource, getEntity, getResource, hasUserInteracted])

    useEffect(() => {
        if (!hasUserInteracted && allEntities?.length > 0)
        getActiveEntity()
    }, [allEntities, getActiveEntity, hasUserInteracted]);

    useEffect(() => {
        if (!hasUserInteracted) {
            setDefaultValue()
        }
    }, [setDefaultValue, hasUserInteracted]);

    const academicYearOptions = useMemo(() => {
        return allEntities?.map(a => ({
            value: a[id],
            label: a[label],
        }))
    }, [allEntities, id, label]);

    const handleChange = useCallback((val: TEntityID | TEntityID[]) => {
            setHasUserInteracted();
            getEntity(val as TEntityID)
            setActiveEntity(val)
            if (getResource) {
                if (Array.isArray(val)) {
                    getResource(allEntities.filter(a => (val as string[]).includes(a[id] as never)) as TEntity[])
                }else {
                    getResource(allEntities.find(a => a[id] === val) as TEntity)
                }
            }
        },
        [allEntities, getEntity, getResource, id, setHasUserInteracted, setActiveEntity]
    );

    return (
        <div className='head-select' style={{width: width}}>
            <Select
                className='select-control'
                value={activeEntity as TEntityID}
                options={academicYearOptions}
                onChange={handleChange}
                variant={variant}
                placeholder={placeholder}
                loading={isLoading}
                mode={multiple ? 'multiple' : undefined}
                style={{width: '100%'}}
            />
        </div>
    )
}