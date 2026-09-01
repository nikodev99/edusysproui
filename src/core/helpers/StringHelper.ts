import {CaseOptions, FormatAvgOptions, TextCase} from "@/core/helpers/types.ts";

type PluralOptions = {
    word?: string;
    allWords?: boolean;
    count?: number;
};

export class StringHelper {
    setPlural(word?: string): string;
    setPlural(word?: string, count?: number): string;
    setPlural(word?: string, options?: PluralOptions): string;
    setPlural(options: PluralOptions): string;
    setPlural(arg?: string | PluralOptions, size?: number | PluralOptions): string {
        const { word, allWords = false, count } = typeof arg === 'object'
            ? arg
            : size && typeof size === 'object' ? {word: arg, options: size} : { word: arg, count: size };

        const toSingular = (w: string): string => {
            if (/[^aeiou]ies$/i.test(w)) return `${w.slice(0, -3)}y`;        // categories -> category
            if (/(ss|x|z|ch|sh)es$/i.test(w)) return w.slice(0, -2);         // classes -> class, boxes -> box
            if (/ss$/i.test(w)) return w;                                    // class -> class (don't strip)
            if (/s$/i.test(w)) return w.slice(0, -1);                        // étudiants -> étudiant
            return w;
        };

        const pluralizeWord = (w: string): string => {
            if (/(ss|x|z|ch|sh)$/i.test(w)) return `${w}es`;
            if (/[^aeiou]y$/i.test(w) && w.length > 1) return `${w.slice(0, -1)}ies`;
            return `${w}s`;
        };

        if (!word) return '';
        const rawWord = word.trim();

        const resolve = (w: string): string => {
            const singular = toSingular(w);
            if (count !== undefined) return count > 1 ? pluralizeWord(singular) : singular;
            return pluralizeWord(singular);
        };

        if (!allWords) return resolve(rawWord);

        return rawWord
            .split(/([\s/\\:;,|()[\]{}-]+)/)
            .map(part =>
                /^[A-Za-zÀ-ÖØ-öø-ÿ0-9]+$/.test(part) ? resolve(part) : part
            )
            .join('');
    }

    formatAvg(
        avg: number | null | undefined,
        options: FormatAvgOptions = {}
    ): string {
        const {
            decimals = 2,
            fallback = 'N/A',
            locale,
            prefix = '',
            suffix = '',
            trimTrailingZeros = false,
        } = options;

        // 1. Guard against null, undefined, NaN, and Infinity (e.g., 0 / 0)
        if (avg === null || avg === undefined || !Number.isFinite(avg)) {
            return fallback;
        }

        // 2. Format with locale support or standard fixed decimals
        let formattedNumber: string;

        if (locale) {
            formattedNumber = new Intl.NumberFormat(locale, {
                minimumFractionDigits: trimTrailingZeros ? 0 : decimals,
                maximumFractionDigits: decimals,
            }).format(avg);
        } else {
            // Avoid floating point rounding bugs (e.g., 1.005.toFixed(2) -> '1.00')
            const rounded = Math.round((avg + Number.EPSILON) * Math.pow(10, decimals)) / Math.pow(10, decimals);
            formattedNumber = rounded.toFixed(decimals);

            if (trimTrailingZeros) {
                formattedNumber = parseFloat(formattedNumber).toString();
            }
        }

        // 3. Assemble the final string
        return `${prefix}${formattedNumber}${suffix}`;
    }

    changeCase(text: string, options?: CaseOptions): string | boolean;
    changeCase(text: string, targetCase?: TextCase, options?: CaseOptions): string | boolean;
    changeCase(
        text: string,
        targetCaseOrOptions?: TextCase | CaseOptions,
        maybeOptions?: CaseOptions
    ): string | boolean {
        const isTextCase = (v: unknown): v is TextCase =>
            v === TextCase.UPPER || v === TextCase.LOWER;

        const targetCase = isTextCase(targetCaseOrOptions) ? targetCaseOrOptions : undefined;
        const options: CaseOptions =
            (isTextCase(targetCaseOrOptions) ? maybeOptions : (targetCaseOrOptions as CaseOptions)) ?? {};

        let result = text;

        // --- cleanup first: changes length/content before anything indexes into the string ---
        if (options.trim) result = result.trim();
        if (options.normalizeSpaces) result = result.replace(/\s+/g, ' ');
        if (options.removeDiacritics) result = this.stripDiacritics(result);

        const preCaseText = result; // snapshot for quote-restore and for length-preserving assumptions below
        const protectedSpans = options.preserveQuotedText ? this.findQuotedSpans(preCaseText) : [];

        const upper = (s: string) => (options.locale ? s.toLocaleUpperCase(options.locale) : s.toUpperCase());
        const lower = (s: string) => (options.locale ? s.toLocaleLowerCase(options.locale) : s.toLowerCase());
        const applyTarget = (s: string) => (targetCase === TextCase.LOWER ? lower(s) : upper(s));

        // --- exclusive strategies: first match in this order wins ---
        if (options.toggleCase) {
            result = this.mapChars(result, (c) => (c === upper(c) ? lower(c) : upper(c)));
        } else if (options.alternatingCase) {
            let i = 0;
            result = this.mapChars(result, (c) => {
                if (!/[a-zA-Z]/.test(c)) return c;
                const out = i % 2 === 0 ? upper(c) : lower(c);
                i++;
                return out;
            });
        } else if (options.sentenceCase) {
            result = this.applySentenceCase(result, upper);
        } else if (options.capitalizeWords) {
            result = this.applyWordCase(result, upper, lower, options.ignoreWords ?? []);
        } else if (options.firstLetterOnly) {
            result = result.length ? upper(result[0]) + result.slice(1) : result;
        } else if (options.positions?.length) {
            result = this.applyToPositions(result, options.positions, targetCase, upper, lower, options.preserveUnselectedPositions);
        } else if (options.targetSubstrings?.length) {
            result = this.applyToSubstrings(result, options.targetSubstrings, applyTarget);
        } else if (options.targetRegex) {
            result = result.replace(options.targetRegex, (match) => applyTarget(match));
        } else if (targetCase) {
            result = this.mapChars(result, applyTarget);
        }

        // --- restore quoted/parenthesized spans to their pre-casing text ---
        if (options.preserveQuotedText) {
            result = this.restoreProtectedSpans(preCaseText, result, protectedSpans);
        }

        if (options.compareWith !== undefined) {
            const ignore = options.ignoreCaseInCompare ?? true
            return ignore
                ? result.toLowerCase() === options.compareWith.toLowerCase()
                : result === options.compareWith;
        }

        return result;
    }

    private stripDiacritics(str: string): string {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    private findQuotedSpans(str: string): Array<[number, number]> {
        const spans: Array<[number, number]> = [];
        const regex = /"[^"]*"|'[^']*'|\([^)]*\)/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(str)) !== null) {
            spans.push([match.index, match.index + match[0].length]);
        }
        return spans;
    }

    private mapChars(str: string, fn: (c: string) => string): string {
        return str.split('').map(fn).join('');
    }

    private applySentenceCase(str: string, upper: (s: string) => string): string {
        let capitalizeNext = true;
        return str
            .split('')
            .map((c) => {
                if (/[.!?]/.test(c)) {
                    capitalizeNext = true;
                    return c;
                }
                if (/\s/.test(c)) return c;
                if (capitalizeNext && /[a-zA-Z]/.test(c)) {
                    capitalizeNext = false;
                    return upper(c);
                }
                return c;
            })
            .join('');
    }

    private applyWordCase(
        str: string,
        upper: (s: string) => string,
        lower: (s: string) => string,
        ignoreWords: string[]
    ): string {
        const ignoreSet = new Set(ignoreWords.map((w) => w.toLowerCase()));
        return str
            .split(' ')
            .map((word, i) => {
                if (!word) return word;
                if (i > 0 && ignoreSet.has(word.toLowerCase())) return lower(word);
                return upper(word[0]) + word.slice(1);
            })
            .join(' ');
    }

    private applyToPositions(
        str: string,
        positions: number[],
        targetCase: TextCase | undefined,
        upper: (s: string) => string,
        lower: (s: string) => string,
        preserveUnselected?: boolean
    ): string {
        const isUpper = targetCase !== TextCase.LOWER; // default UPPER when targetCase omitted
        const targetSet = new Set(positions);
        return str
            .split('')
            .map((c, i) => {
                if (targetSet.has(i)) return isUpper ? upper(c) : lower(c);
                if (preserveUnselected) return c;
                return isUpper ? lower(c) : upper(c); // force opposite on unselected chars
            })
            .join('');
    }

    private applyToSubstrings(str: string, substrings: string[], applyTarget: (s: string) => string): string {
        let result = str;
        for (const sub of substrings) {
            if (!sub) continue;
            result = result.split(sub).join(applyTarget(sub));
        }
        return result;
    }

    private restoreProtectedSpans(
        preCaseText: string,
        transformed: string,
        spans: Array<[number, number]>
    ): string {
        if (!spans.length || preCaseText.length !== transformed.length) return transformed;
        const chars = transformed.split('');
        for (const [start, end] of spans) {
            for (let i = start; i < end; i++) chars[i] = preCaseText[i];
        }
        return chars.join('');
    }

}

export const stringhelper = new StringHelper()