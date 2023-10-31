import React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DialogModal from '@/components/shared/DialogModal/dialog-modal';
import planet from '@/public/images/spaces/planet.png';
import Image from 'next/image';
import CreateSpaceForm from '@/components/home/create-space-form';


export default function Home() {

  return (
    <>
      <Container component="section" maxWidth="xs" >
        <CssBaseline />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <DialogModal button={<NewSpaceButton />} childrenTitle={<CreateSpaceDialogTitle />} childrenBody={<CreateSpaceForm />} />
        </Box>
      </Container>
    </>
  );
}


const NewSpaceButton = () => {
  return (
    <Button variant="outlined" color="secondary"
      startIcon={<><AddIcon /><GroupsIcon /></>}
    >
      <Typography fontWeight={600}>
        New Space
      </Typography>
    </Button>
  );
}

const CreateSpaceDialogTitle = () => {
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Image
          src={planet}
          width={130}
          height={0}
          alt="logo"
        // sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' define something like this to improve future performance on images
        />
        <Typography fontWeight={600} fontSize='1.1em' pb={2}>
          Create new Space
        </Typography>
      </Box>
    </>
  )
}