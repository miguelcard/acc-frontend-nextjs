import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CreateSpaceModal from '@/components/spaces/CreateSpaceModal/create-space-modal';
import SpacesOverview from '@/components/spaces/SpacesOverview/spaces-overview';

export default function SpacesHome() {
    return (
        <>
            <Container component="section" maxWidth="lg">
                <CssBaseline />
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                    <SpacesOverview />
                    <CreateSpaceModal />
                </Box>
            </Container>
        </>
    );
}
