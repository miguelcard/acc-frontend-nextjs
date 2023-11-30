import localFont from 'next/font/local';
import { Inter, Ubuntu } from 'next/font/google';

// Common place to define the application's fonts

export const inter = Inter({
    variable: "--font-inter",
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export const ubuntu = Ubuntu({
    variable: "--font-ubuntu",
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export const euclidA = localFont({
    variable: "--font-euclida",
    display: "swap",
    src: [
        {
            path: './EuclidCircularA-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './EuclidCircularA-Medium.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: './EuclidCircularA-SemiBold.woff2',
            weight: '700',
            style: 'bold',
        },
    ],
});

export const euclidB = localFont({
    variable: "--font-euclidb",
    display: "swap",
    src: "./EuclidCircularB-Regular.woff2",
});