import styles from './page.module.css';
import Box from '@mui/material/Box';
import HeroBanner from '@/components/landing/HeroBanner/hero-banner';

/**
 * Landing page — public marketing/info page.
 * Accessible at /landing. The root / redirects to /spaces on app open.
 */
export default function LandingPage() {
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
