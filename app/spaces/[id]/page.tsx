import 'server-only';
import { getAuthCookie, getErrorMessage } from '@/lib/utils';
import { GENERIC_ERROR_MESSAGE } from '@/lib/types-and-constants';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { stringIconMapper } from '@/lib/fa-icons-mapper';
import Avatar from '@mui/material/Avatar';

interface Space {
  id: number;
  name: string;
  description?: string;
  tags?: string[];
  members_count?: number;
  habits_count?: number;
  space_habits?: any[]; // Todo change for habits type, any[] for now
  created_at?: string;
  updated_at?: string;
  creator?: number;
  members?: number[];
};


/**
 * Gets a Single Space by its ID
 * @param params id
 * @returns space
 */
async function getSpace(id: number) {
  const url = `${process.env.NEXT_PUBLIC_API}/v1/spaces/${id}`;
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Cookie": `${getAuthCookie()}`,
    },
    cache: 'no-store'
  };

  try {
    const res = await fetch(url, requestOptions);
    const space = await res.json();
    if (!res.ok) {
      console.warn("Fetching individual space didn't work");
      console.warn(getErrorMessage(space));
      return { error: GENERIC_ERROR_MESSAGE };
    }
    return space;

  } catch (error) {
    console.warn("An error ocurred: ", getErrorMessage(error));
    return { error: GENERIC_ERROR_MESSAGE };
  }
}


export default async function Space({ params }: { params: { id: number } }) {
  const { id } = params;
  const spaceResponse = await getSpace(id);

  if (spaceResponse.error) {
    // write an error message in the GUI manually or throw an error to be handled by next error boundry.
  }

  // Assigning a type to the response object
  const space: Space = spaceResponse;

  return (
    <Container component="section" maxWidth="lg" >
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Box width={"100%"}>

          <Box display="flex" alignItems="center" gap="24px">
            <Avatar
              sx={{ width: 64, height: 64 }}
            >
              <FontAwesomeIcon icon={stringIconMapper.rocket} size='xl' />
            </Avatar>
            <Typography fontWeight='700' fontSize="1.4em" color="secondary">
              {space.name + "a really looong description bla bla bla I mean a really long title bla bla bla, woohooo"}
            </Typography>
          </Box>

          add line break? __________________________________________________________________________
          <PlaceHolderCard text={"Stats..."} />
          <PlaceHolderCard text={"Scorecard / Calendar"} />
          This is the Space with ID: {space.id} <br />
          space name: {space.name} <br />
          {/* space desc: {space.description} ssssssssssssssssss sssss fdssssssssssssss ssssssssssssssss ssssssssssssss sssssss sssssssssssfdfddfd ssssssssssssssssssssss ssssssssssssssssssssssssssssssssssssss ksdfjkj sdfkjkj ldsfkjlsadkjf  <br /> */}
        </Box>
      </Box>
    </Container>
  );
}





const PlaceHolderCard = ({ text }: any) => {
  return (
    <Card
      variant="outlined"
      sx={{
        my: 3,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: "#E8EAED"
      }}>
      <CardContent>
        <Typography
          fontWeight='500'
          sx={{ py: 3 }}
        >
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
}