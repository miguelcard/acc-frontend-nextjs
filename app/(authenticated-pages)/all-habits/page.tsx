'use client';
import { useEffect, useState } from 'react';
import { AllUserHabitsView } from '@/components/all-habits/AllUserHabits/all-user-habits';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import { HabitT, PaginatedResponse, SpaceT } from '@/lib/types-and-constants';
import { getAllUserRecurrentHabits, getUserSpaces } from '@/lib/fetch-functions';
import { groupHabitsBySpace, SpaceHabitsGroup } from '@/lib/utils/group-habits-by-space';
import Typography from '@mui/material/Typography';

export default function AllHabitsOverview() {
  const [groupedHabits, setGroupedHabits] = useState<SpaceHabitsGroup[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUserRecurrentHabits(), getUserSpaces()]).then(([habitsPaginated, spacesPaginated]) => {
      if (habitsPaginated?.error) {
        console.warn('Could not fetch all user recurrent habits: ', habitsPaginated.error);
        setLoading(false);
        return;
      }
      if (spacesPaginated?.error) {
        console.warn('retrieving user spaces has an error :', spacesPaginated.error);
        setLoading(false);
        return;
      }
      const habits: HabitT[] = habitsPaginated.results;
      const spaces: SpaceT[] = spacesPaginated.results;
      setGroupedHabits(groupHabitsBySpace(habits, spaces));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Box py={6} display="flex" justifyContent="center"><CircularProgress color="secondary" size={60} /></Box>;
  }

  if (!groupedHabits) {
    return null;
  }

  return (
    <Container component="section" maxWidth="lg">
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        width="100%"
      >
        <Typography fontSize='1.3em' fontWeight={800} pb={1} pt={2} >
          All my Habits by Space
        </Typography>
        <AllUserHabitsView userHabitsGroupedBySpace={groupedHabits} ></AllUserHabitsView>
      </Box>
    </Container>
  )
}
