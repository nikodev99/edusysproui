import {SelectEntity} from "../../core/utils/interfaces.ts";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Select} from "antd";

export const CustomEntitySelect = <TEntity extends object, TEntityID extends string | number | number[]>(
    {
        data, getEntity, uniqueValue, uniqueValue: {key, value}, options: {id, label}, width = '200px', getResource,
        entities, onlyCurrent, variant = 'borderless', placeholder, isLoading, multiple,
    }: SelectEntity<TEntity, TEntityID>
) => {
    const [allEntities, setAllEntities] = useState<TEntity[]>([])
    const [activeResource, setActiveResource] = useState<TEntity | TEntity[]>()
    const [activeEntity, setActiveEntity] = useState<TEntityID | TEntityID[]>()

    const getActiveEntity = useCallback(() => {
        if (Array.isArray(value)) {
            const activeEntities = allEntities
                .filter(a => (value as string[]).includes(a[key as keyof TEntity] as never))
                
            setActiveEntity(activeEntities.map(entity => entity[id]) as TEntityID[]);
            if(getResource) {
                setActiveResource(activeEntities)
            }

        }else {
            const entity = allEntities.find(a => a[key as keyof TEntity] === value)
            setActiveEntity(entity?.[id] as TEntityID)
            if (getResource) {
                setActiveResource(entity)
            }
        }
    }, [allEntities, getResource, id, key, value])

    const setDefaultValue = useCallback(() => {
        if (activeEntity) {
            getEntity(activeEntity)
            if(getResource) {
                getResource(activeResource as TEntity)
            }
        }
    }, [activeEntity, activeResource, getEntity, getResource])
    
    useEffect(() => {
        let base = entities && entities.length > 0 ? entities : data;
        if (onlyCurrent != null && uniqueValue?.key) {
            const key = uniqueValue.key;

            base = base.filter(a => a[key] === onlyCurrent);
        }
        setAllEntities(base);
    }, [data, entities, onlyCurrent, uniqueValue?.key]);

    useEffect(() => {
        setDefaultValue()
    }, [setDefaultValue]);

    useEffect(() => {
        getActiveEntity()
    }, [getActiveEntity]);

    const academicYearOptions = useMemo(() => {
        return allEntities?.map(a => ({
            value: a[id],
            label: a[label],
        }))
    }, [allEntities, id, label]);

    const handleChange = useCallback(
        (val: TEntityID | TEntityID[]) => {
            getEntity(val as TEntityID)
            if (getResource) {
                if (Array.isArray(val)) {
                    getResource(allEntities.filter(a => (val as string[]).includes(a[id] as never)) as TEntity[])
                }else {
                    getResource(allEntities.find(a => a[id] === val) as TEntity)
                }
            }
        },
        [allEntities, getEntity, getResource, id]
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