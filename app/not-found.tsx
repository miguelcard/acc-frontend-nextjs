'server-only';
import notFoundSpaces from '@/public/images/errors/not-found-spaces.svg';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      minHeight="100vh"
      gap={{ xs: 8, sm: 8, md: 8 }}
    >
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        gap={0}
        pb={4}
      >
        <Typography fontWeight={800} fontSize='2.2em' >
          Oops!
        </Typography>
        <Typography fontWeight={400} fontSize='0.8em' >
          Page Not Found
        </Typography>
      </Box>

      {/* 404 message overlapping image */}
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="230px"
      >
        <Typography
          fontSize={{ xs: '7em', sm: '7em', md: '8em' }}
          position="absolute"
          bottom="60%"
          // top="-35%" // Adjust position
          left="50%"
          sx={{
            transform: "translateX(-50%)", fontWeight: "800", zIndex: 0,
            background: "linear-gradient(45deg, rgb(0, 0, 0, 0.08),rgba(0, 0, 0, 0.85))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </Typography>
        <img src={notFoundSpaces.src ?? notFoundSpaces} width={180} alt="not-found" style={{ position: "relative", zIndex: 1, height: 'auto' }} />
      </Box>

      <Button component={Link} href="/spaces" variant='contained' sx={{bgcolor: 'black', textTransform: 'none' }}  >Back to Homepage</Button>
    </Box>
  );
}