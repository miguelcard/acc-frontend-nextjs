import 'server-only';
import Image from 'next/image';
import styles from './page.module.css';
import Box from '@mui/material/Box';
import HeroBanner from '@/components/landing/HeroBanner/hero-banner';

/**
 * Landing page for unauthenticated users
 * @returns 
 */
export default function Home() {
    return (
        <div>
            <main>
                {/* put whole body inside a grid? ... for now not needed ...*/}
                <Image
                    src="/images/landing/landing-blob.png"
                    width={900}
                    height={0}
                    alt="Blob"
                    className={styles.home__blob}
                    priority={true}
                />
                <Box className={styles['home__hero-header']} >
                    <HeroBanner />
                </Box>
            </main>
        </div>
    )
}
