import React, { createContext, useContext, useState } from 'react';
import type { ReactNode, ReactElement } from 'react';

export type Language = 'en' | 'de';

const translations: Record<Language, Record<string, string>> = {
    en: {
        landing: 'Landing',
        programs: 'Programs',
        login: 'Login',
        applicationNew: 'New Application',
        backoffice: 'Backoffice',
    },
    de: {
        landing: 'Landing',
        programs: 'Programme',
        login: 'Login',
        applicationNew: 'Antrag stellen',
        backoffice: 'Backoffice',
    },
};

interface I18nContextProps {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextProps>({
    lang: 'de',
    setLang: () => { },
    t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }): ReactElement {
    const [lang, setLang] = useState<Language>('de');
    const t = (key: string) => translations[lang][key] || key;
    return (
        <I18nContext.Provider value={{ lang, setLang, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    return useContext(I18nContext);
}