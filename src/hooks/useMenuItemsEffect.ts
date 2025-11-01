import {ItemType} from "antd/es/menu/interface";
import {useCallback, useEffect, useMemo, useRef} from "react";

export type ItemComparator = (item1?: ItemType[], item2?: ItemType[]) => boolean

export const useMenuItemsEffect = (items?: ItemType[], getItems?: (items: ItemType[]) => void, comparator?: ItemComparator) => {
    const prevItemsRef = useRef<ItemType[] | undefined>(undefined);

    const defaultItemsComparator: ItemComparator = useCallback((a?: ItemType[], b?: ItemType[]): boolean => {
        if (a === b) return true;
        if (!a || !b) return false;
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            const ai: ItemType = a[i];
            const bi: ItemType = b[i];
            if (ai?.key !== bi?.key) return false;
        }
        return true;
    }, []);
    
    const itemComparator = useMemo(() => comparator ?? defaultItemsComparator, [comparator, defaultItemsComparator]);

    useEffect(() => {
        if (!getItems) return;
        const prev = prevItemsRef.current;
        if (itemComparator(prev, items)) return; // pas de changement réel → pas d'appel
        prevItemsRef.current = items;
        if (items) getItems(items);
    }, [getItems, itemComparator, items]);
}