'use client';
import React, { useMemo } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { Options } from '@emotion/cache';
import theme from './theme';

type ThemeRegistryProps = {
    /** This is the options passed to createCache() from 'import createCache from "@emotion/cache"' */
    options: Omit<Options, 'insertionPoint'>;
    children: React.ReactNode;
};

export default function ThemeRegistry(props: ThemeRegistryProps) {
    const { options, children } = props;

    const cache = useMemo(() => {
        const cache = createCache(options);
        cache.compat = true;
        return cache;
    }, [options]);

    return (
        <CacheProvider value={cache}>
             <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
             </ThemeProvider>
        </CacheProvider>
    );
}
