type PluralOptions = {
    word?: string;
    allWords?: boolean;
    count?: number;
};

export class StringHelper {
    setPlural(word?: string): string;
    setPlural(options: PluralOptions): string;
    setPlural(arg?: string | PluralOptions): string {
        const { word, allWords = false, count } =
            typeof arg === 'object' ? arg : { word: arg };

        const toSingular = (w: string): string => {
            if (/[^aeiou]ies$/i.test(w)) return `${w.slice(0, -3)}y`;        // categories -> category
            if (/(ss|x|z|ch|sh)es$/i.test(w)) return w.slice(0, -2);         // classes -> class, boxes -> box
            if (/ss$/i.test(w)) return w;                                    // class -> class (don't strip)
            if (/s$/i.test(w)) return w.slice(0, -1);                        // etudiants -> etudiant
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
}

export const stringhelper = new StringHelper()