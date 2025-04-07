import 'server-only';
import React from 'react'
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import heroImage from '@/public/images/landing/hero-image.png';
import Image from 'next/image';
import HeroText from '../HeroText/hero-text';

/**
 * Landing page hero section which includes hero text, action button and image
 * @returns
 */
export default function HeroBanner() {

    return (
        <Container maxWidth="xl" sx={{ px: '16px' }} component='section' >
            <Grid container
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                sx={{ pt: 7 }}
                rowSpacing={{ xs: 5, sm: 7 }}
            >
                <Grid container size={{ md: 6 }}
                    justifyContent="center"
                >
                    <HeroText />
                </Grid>
                <Grid size={{ md: 6 }}
                    sx={{ textAlign: 'center' }}
                >
                    <Image
                        src={heroImage}
                        width={300}
                        height={0}
                        alt="hero"
                        style={{ position: "relative" }}
                    // sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' define something like this to improve future performance on images
                    />
                </Grid>
            </Grid>
        </Container>
    );
}
