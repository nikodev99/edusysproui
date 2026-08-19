import {Dayjs, ManipulateType} from "dayjs";
import Datetime from "@/core/datetime.ts";
import {Moment} from "@/core/utils/interfaces.ts";

export const DEFAULT_SIMPLE_LABELS = {
    seconds : 'sec.',
    minutes : 'min.',
    hours   : 'h',
    days    : 'jour(s)',
    weeks   : 'sem.',
    months  : 'mois',
    years   : 'An',
};

export const DEFAULT_COMPOUND_LABELS: Record<UnitKey, string> = {
    y   : 'An(s)',
    m   : 'mois',
    w   : 'sem.',
    d   : 'jour(s)',
    h   : 'h',
    min : 'min.',
    s   : 'sec.',
};

export const UNIT_TO_DAYJS: Record<UnitKey, ManipulateType> = {
    y   : 'year',
    m   : 'month',
    w   : 'week',
    d   : 'day',
    h   : 'hour',
    min : 'minute',
    s   : 'second',
};

export type SimpleLabelKey      = keyof typeof DEFAULT_SIMPLE_LABELS;
export type SimpleLabelOverride = Partial<Record<SimpleLabelKey, string>>;
export type UnitKey = 'y' | 'm' | 'w' | 'd' | 'h' | 'min' | 's';

export type TimeAgoInput = Datetime | Dayjs | Moment;
export type CommonOptions = {
    showLabels? : boolean;          // default true
    now?        : TimeAgoInput;     // custom reference point instead of "right now"
    direction?  : boolean | Partial<DirectionLabels>; // true = French defaults, object = override
};
export type SimpleOptions = CommonOptions & {
    compound?  : never;
    labels?    : SimpleLabelOverride;
};
export type CompoundOptions = CommonOptions & {
    compound   : string;                          // 'y-m' | 'w-d' | 'y-m-d' | etc.
    labels?    : Partial<Record<UnitKey, string>>;
    separator? : string;                          // default 'et'
    skipZero?  : boolean;                         // skip parts where value = 0, default true
};
export type TimeAgoOptions = SimpleOptions | CompoundOptions;
export type DirectionLabels = {
    past   : { prefix?: string; suffix?: string };  // "il y a {x}" or "{x} ago"
    future : { prefix?: string; suffix?: string };  // "dans {x}" or "in {x}"
};

export const DEFAULT_DIRECTION_LABELS: DirectionLabels = {
    past   : { prefix: 'il y a' },
    future : { prefix: 'dans'   },
};


export type FormatAvgOptions = {
    /**
     * Number of decimal places to display.
     * @default 2
     */
    decimals?: number;

    /**
     * Fallback string if the input is not a finite number (NaN, Infinity, null, undefined).
     * @default 'N/A'
     */
    fallback?: string;

    /**
     * Locale code for formatting thousands of separators and decimal points (e.g., 'fr-FR', 'en-US').
     * If omitted, standard non-localized formatting is used.
     */
    locale?: string;

    /**
     * Optional prefix (e.g., '$', 'avg: ').
     */
    prefix?: string;

    /**
     * Optional suffix (e.g., '%', 'pts', '/20').
     */
    suffix?: string;

    /**
     * Whether to strip trailing zeros after rounding (e.g., 11.40 -> '11.4' or 11.00 -> '11').
     * @default false
     */
    trimTrailingZeros?: boolean;
}