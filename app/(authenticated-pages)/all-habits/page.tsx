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
import QueryError from '@/components/shared/QueryError/query-error';

export default function AllHabitsOverview() {
  const { data: habitsPaginated, isLoading: habitsLoading, isError: habitsError, refetch: refetchHabits } = useAllRecurrentHabits();
  const { data: spacesPaginated, isLoading: spacesLoading, isError: spacesError, refetch: refetchSpaces } = useUserSpaces();

  const loading = habitsLoading || spacesLoading;
  const hasError = habitsError || spacesError;

  const groupedHabits = useMemo(() => {
    if (!habitsPaginated || !spacesPaginated) return null;
    const habits: HabitT[] = habitsPaginated.results;
    const spaces: SpaceT[] = spacesPaginated.results;
    return groupHabitsBySpace(habits, spaces);
  }, [habitsPaginated, spacesPaginated]);

  // Only show error screen when we have NO cached data to display.
  // When offline with cached data, hasError may be true but we still want
  // to render the stale data rather than an error screen.
  if (hasError && !groupedHabits) {
    return <QueryError onRetry={() => { refetchHabits(); refetchSpaces(); }} />;
  }

  if (loading && !groupedHabits) {
    return <Box py={6} display="flex" justifyContent="center"><CircularProgress color="secondary" size={60} /></Box>;
  }

  if (!groupedHabits) {
    return <QueryError onRetry={() => { refetchHabits(); refetchSpaces(); }} />;
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
