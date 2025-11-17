import 'server-only';
import { AllUserHabitsView } from '@/components/all-habits/AllUserHabits/all-user-habits';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import { HabitT, PaginatedResponse, SpaceT } from '@/lib/types-and-constants';
import { getAllUserRecurrentHabits, getUserSpaces } from '@/lib/fetch-functions';
import { groupHabitsBySpace, SpaceHabitsGroup } from '@/lib/utils/group-habits-by-space';
import Typography from '@mui/material/Typography';

export default async function AllHabitsOverview() {
  const habitsPaginated:  PaginatedResponse<HabitT> = await getAllUserRecurrentHabits();

  if (habitsPaginated?.error) {
    console.warn('Could not fetch all user recurrent habits: ', habitsPaginated.error);
    return;
  }
  const habits: HabitT[] = habitsPaginated.results;

  const spacesPaginated: PaginatedResponse<SpaceT> = await getUserSpaces();
  
  if (spacesPaginated?.error) {
    // TODO how do I display this error messages in the gui without having to create a client component?
    // use sub-(client)-component ?
    // or just throw error to be handled by next js
    console.warn('retrieving user spaces has an error :', spacesPaginated.error);
    return;
  }
  const spaces: SpaceT[] = spacesPaginated.results;

  const groupedHabits: SpaceHabitsGroup[] = groupHabitsBySpace(habits, spaces);

  return (
    <Container component="section" maxWidth="lg">
      <CssBaseline />
      <Box
        display="flex"
        // position="relative"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        width="100%"
      >
        <Typography fontSize='1.3em' fontWeight={800} pb={1} pt={2} color='secondary'>
          All my Habits by Space
        </Typography>
        <AllUserHabitsView userHabitsGroupedBySpace={groupedHabits} ></AllUserHabitsView>
      </Box>
    </Container>
  )
}
