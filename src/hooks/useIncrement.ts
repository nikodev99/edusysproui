import {useState} from "react";

export const useIncrement = (initialValue: number = 0, options?: {min: number, max: number}): { count: number, increment: () => void, decrement: () => void } => {
    const [state, setState] = useState<number>(initialValue)
    return {
        count: state,
        increment: () => setState(state => options?.max ? state < options.max ? state + 1 : state : state + 1),
        decrement: () => setState(state => options?.min ? state > options.min ? state - 1 : state : state - 1),
    }
}