import styles from './page.module.css';
import Box from '@mui/material/Box';
import HeroBanner from '@/components/landing/HeroBanner/hero-banner';

/**
 * Landing page — public marketing/info page.
 * Users can browse this freely; Firebase anonymous auth happens in the background.
 */
export default function Home() {
    return (
        <div>
            <main>
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
