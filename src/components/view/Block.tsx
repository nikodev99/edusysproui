import { Children, isValidElement, ReactNode } from 'react'
import { Masonry } from 'react-plock'
import BlockItem from "@/components/ui/layout/BlockItem.tsx";

type NamedBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
type NamedColumnsCountBreakPoints = Partial<Record<NamedBreakpoint, number>>
type PxColumnsCountBreakPoints = Record<number, number>

const NAMED_BREAKPOINTS_PX: Record<NamedBreakpoint, number> = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
}

const DEFAULT_BREAKPOINTS: PxColumnsCountBreakPoints = { 350:1, 750:2, 1100:3, 2000:4 }

const isNamedBreakpoints = (
    value: PxColumnsCountBreakPoints | NamedColumnsCountBreakPoints
): value is NamedColumnsCountBreakPoints =>
    Object.keys(value).some((key) => key in NAMED_BREAKPOINTS_PX)

const resolveBreakpoints = (
    responsive?: PxColumnsCountBreakPoints | NamedColumnsCountBreakPoints
): PxColumnsCountBreakPoints => {
    if (!responsive) return DEFAULT_BREAKPOINTS
    if (!isNamedBreakpoints(responsive)) return responsive as PxColumnsCountBreakPoints

    return Object.entries(responsive).reduce<PxColumnsCountBreakPoints>((acc, [key, count]) => {
        const px = NAMED_BREAKPOINTS_PX[key as NamedBreakpoint]
        if (px !== undefined && count !== undefined) acc[px] = count
        return acc
    }, {})
}

// react-plock wants parallel arrays (columns/gap/media), sorted ascending by breakpoint,
// with columns.length === gap.length === media.length
const toBlockConfig = (
    responsive: PxColumnsCountBreakPoints | NamedColumnsCountBreakPoints | undefined,
    gap: number,
    useBalancedLayout: boolean
) => {
    const sorted = Object.entries(resolveBreakpoints(responsive))
        .map(([px, count]) => [Number(px), count] as [number, number])
        .sort(([a], [b]) => a - b)

    // Single breakpoint → plock's scalar "fixed columns" form, no media needed
    if (sorted.length <= 1) {
        return {
            columns: sorted[0]?.[1] ?? 1,
            gap,
            useBalancedLayout,
        }
    }

    const keys = sorted.map(([px]) => px)
    const columns = sorted.map(([, count]) => count)

    // plock's algorithm uses columns[i] for width in [keys[i-1], keys[i]).
    // To replicate "columns[i] applies once width >= keys[i]" (react-responsive-masonry
    // semantics), we drop the first key and duplicate the last one to pad the array.
    const media = [...keys.slice(1), keys[keys.length - 1]]

    return {
        columns,
        gap: columns.map(() => gap),
        media,
        useBalancedLayout,
    }
}

interface BlockProps {
    items?: ReactNode[]
    children?: ReactNode
    responsive?: PxColumnsCountBreakPoints | NamedColumnsCountBreakPoints
    gap?: number
    useBalancedLayout?: boolean
}

const Block = ({
                   items,
                   children,
                   responsive,
                   gap = 12,
                   useBalancedLayout = true,
               }: BlockProps) => {
    const content = items ?? Children.toArray(children)

    return (
        <Masonry
            items={content}
            config={toBlockConfig(responsive, gap, useBalancedLayout)}
            render={(item, index) => {
                if (!isValidElement(item)) return null

                const dataKey = (item.props as { dataKey?: string })?.dataKey

                return (
                    <BlockItem key={dataKey ? `${dataKey}-${index}` : index} dataKey={dataKey} children={item} />
                )
            }}
        />
    )
}
export default Block;