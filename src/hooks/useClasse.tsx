import {useEffect} from "react";
import {initCountAllClasse, useGlobalStore} from "../core/global/store.ts";

export const useClasse = () => {
    const classeCount = useGlobalStore.use.countAllClasse()
    const classes = useGlobalStore.use.allClasses()

    useEffect(() => {
        if (classeCount === 0 || classes.length === 0) {
            initCountAllClasse()
        }
    }, [classeCount, classes.length])

    return {classeCount, classes}
}