'use client';
import React, { useState } from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { Options } from '@emotion/cache';
import theme from './theme';

// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902

type ThemeRegistryProps = {
    /** This is the options passed to createCache() from 'import createCache from "@emotion/cache"' */
    options: Omit<Options, 'insertionPoint'>;
    children: React.ReactNode;
};

export default function ThemeRegistry(props: ThemeRegistryProps) {
    const { options, children } = props;

    const [{ cache, flush }] = useState(() => {
        const cache = createCache(options);
        cache.compat = true;
        const prevInsert = cache.insert;
        let inserted: string[] = [];
        cache.insert = (...args) => {
            const serialized = args[1];
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push(serialized.name);
            }
            return prevInsert(...args);
        };
        const flush = () => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };
        return { cache, flush };
    });

    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0) {
            return null;
        }
        let styles = '';
        for (const name of names) {
            styles += cache.inserted[name];
        }
        return (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(' ')}`}
                dangerouslySetInnerHTML={{
                    __html: styles,
                    // __html: options.prepend ? `@layer emotion {${styles}}` : styles,
                }}
            />
        );
    });

    return (
        // This is messing whith some of the original css styles form the MUI components, for example the TextField (in login)
        // note: the theme has no influence on the styles being fucked up, only the cache provider
        // it only happens when the page is reloaded multiple times
        // the CSS baseline does not seem to affect it
        
        // I think at some point the wrong value gets stored into cache or something like that and it stays there?

        // The cache provider stores generated css styles to ensure that styles are efficiently reused across your application.
        // The problem seems to be then, that this cached style that is being generated is not 100% correct, and only the first load shows the <Text-field> formatted as it should be
        
        // for now 2 options work fine:
        // 1. using CacheProvider and __html: styles,
        // 2. disabling cache provider
        <CacheProvider value={cache}>
             <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
             </ThemeProvider>
        </CacheProvider>
    );
}
