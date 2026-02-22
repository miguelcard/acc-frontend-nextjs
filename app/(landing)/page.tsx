import 'server-only';

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
                <img
                    src="/images/landing/landing-blob.png"
                    width={900}
                    alt="Blob"
                    className={styles.home__blob}
                    style={{ height: 'auto' }}
                />
                <Box className={styles['home__hero-header']} >
                    <HeroBanner />
                </Box>
            </main>
        </div>
    )
}
