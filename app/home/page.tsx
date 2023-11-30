import 'server-only';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CreateSpaceModal from '@/components/home/CreateSpaceModal/create-space-modal';
import SpacesOverview from '@/components/home/SpacesOverview/spaces-overview';

export default async function Home() {

  return (
    <>
      <Container component="section" maxWidth="lg" >
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          {/* // Here on top goes the dashboard showing some meaningful (main) habits, motivating data for user to see first
          // or something the user can see first that is novel / makes him crave going back... */}

          {/* // retrieve your spaces here,
          // if no spaces are found just show a message that no spaces are found and prompt to create a new one */}
          <SpacesOverview />
          <CreateSpaceModal />
        </Box>
      </Container>
    </>
  );
}