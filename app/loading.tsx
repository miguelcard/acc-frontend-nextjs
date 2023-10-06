import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  
  return <Box
    display='flex'
    justifyContent='center'
    alignItems='center'
    height='100vh'
  >
    <CircularProgress color="secondary" size={'100px'} />
  </Box>
}