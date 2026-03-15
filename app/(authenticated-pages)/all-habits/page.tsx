'use client';
import { useMemo } from 'react';
import { AllUserHabitsView } from '@/components/all-habits/AllUserHabits/all-user-habits';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import { HabitT, SpaceT } from '@/lib/types-and-constants';
import { groupHabitsBySpace } from '@/lib/utils/group-habits-by-space';
import Typography from '@mui/material/Typography';
import { useAllRecurrentHabits, useUserSpaces } from '@/lib/hooks/queries';

export default function AllHabitsOverview() {
  const { data: habitsPaginated, isLoading: habitsLoading } = useAllRecurrentHabits();
  const { data: spacesPaginated, isLoading: spacesLoading } = useUserSpaces();

  const loading = habitsLoading || spacesLoading;

  const groupedHabits = useMemo(() => {
    if (!habitsPaginated || habitsPaginated.error || !spacesPaginated || spacesPaginated.error) return null;
    const habits: HabitT[] = habitsPaginated.results;
    const spaces: SpaceT[] = spacesPaginated.results;
    return groupHabitsBySpace(habits, spaces);
  }, [habitsPaginated, spacesPaginated]);

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
