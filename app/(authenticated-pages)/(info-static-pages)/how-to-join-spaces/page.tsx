import 'server-only';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BackButtonBarWithText } from '@/components/shared/back-button-bar-with-text';
import Button from '@mui/material/Button';
import Link from 'next/link';


export default function HowToJoinSpaces() {
    return (
        <>
            <Container component="section" maxWidth="lg">
                <CssBaseline />

                <BackButtonBarWithText
                    text={'How to join an existing space'}
                    backButtonPath='spaces'
                    sx={{ fontWeight: 800 }}
                />

                <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                >

                    <Typography pt={5}>
                        This beta version of the app is designed for communities that already exist outside the platform. To join an existing space, a current member must add you by your username.
                        <br /><br />In future releases, we plan to introduce a “Discover” feature that will allow you to explore various communities and topics—and request to join any spaces that interest you.
                    </Typography>


                    <Button component={Link} href={"/spaces"} variant='contained' sx={{bgcolor: 'black', textTransform: 'none', mt: 7 }}  >Got It</Button>
                </Box>
            </Container>
        </>
    )
}
