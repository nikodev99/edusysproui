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