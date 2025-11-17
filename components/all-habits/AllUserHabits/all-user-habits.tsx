'use client';

import { HabitT } from '@/lib/types-and-constants';
import { Avatar, Box, ButtonBase, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import DatesRangeSelector from '@/components/space/ScoreCard/dates-range-selector';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ContentCard from '@/components/shared/ContentCard/content-card';
import { SmallScreenHabitScoreCard } from '@/components/space/ScoreCard/score-card-sizes/small-screen-habit-score-card';
import { useHabitScorecard } from '@/lib/hooks/useHabitScorecard';
import { SpaceHabitsGroup } from '@/lib/utils/group-habits-by-space';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { stringIconMapper } from '@/lib/fa-icons-mapper';
import { setMaxStringLength } from '@/lib/client-utils';
import { grey } from '@mui/material/colors';
import { useRouter } from 'next/navigation';


type UserAllHabitsViewPropsT = {
    userHabitsGroupedBySpace: SpaceHabitsGroup[];
    onDateRangeChange?: (dateRangeCode: string) => Promise<HabitT[]>;
};

export function AllUserHabitsView({
    userHabitsGroupedBySpace,
    onDateRangeChange
}: UserAllHabitsViewPropsT) {

    const router = useRouter();

    // Flatten all habits from all spaces for initial state
    const allUserHabits = useMemo(() =>
        userHabitsGroupedBySpace.flatMap(space => space.habits),
        [userHabitsGroupedBySpace]
    );

    // Use shared hook for scorecard logic
    const { dates, setDates, checkedDates, setCheckedDates, updateCheckedDates } =
        useHabitScorecard(allUserHabits);

    // ============================= Collapse state (specific to this view)
    const [collapsedSpaces, setCollapsedSpaces] = useState<number[]>([]);

    const handleCollapseSpaceCard = (spaceId: number) => {
        if (collapsedSpaces.includes(spaceId)) {
            setCollapsedSpaces((prev) => prev.filter((id) => id !== spaceId));
        } else {
            setCollapsedSpaces([...collapsedSpaces, spaceId]);
        }
    };

    // Wrapper to handle date range updates
    const handleDateRangeUpdate = async (dateRangeCode: string) => {
        if (onDateRangeChange) {
            await updateCheckedDates(dateRangeCode, onDateRangeChange);
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            <DatesRangeSelector
                dates={dates}
                setDates={setDates}
                updateCheckedDates={handleDateRangeUpdate}
            />

            {userHabitsGroupedBySpace.map((spaceGroup) => {
                const { space, habits } = spaceGroup;

                return (
                    <Box key={space.id} sx={{ mb: 2 }}>
                        {/* =========================================== Space name header */}
                        <Box
                            component={'div'}
                            sx={{
                                display: 'flex',
                                gap: '5px',
                                alignItems: 'center',
                                height: '100%',
                                marginBottom: 0.5,
                                marginX: 1,
                                color: 'black',
                            }}
                        >
                            <Box pb={1} gap={1.5} display='flex' flexDirection='row'>
                                {/* ==== Space Avatar surrounded by colorful gradient ring =====*/}
                                <Box
                                    onClick={() => router.push(`/spaces/${space.id}`)}
                                    sx={{
                                        cursor: 'pointer',
                                        width: 39,
                                        height: 39,
                                        p: '2px',
                                        borderRadius: '0.75rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: "conic-gradient(from 0deg, #9A00FF, #4A00FF, #00E5FF, #00FFC8, #5E00FF, #B400FF, #FF00E5, #9A00FF)",
                                    }}
                                >
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '0.75rem',
                                            bgcolor: grey[500],
                                        }}
                                    >
                                        <FontAwesomeIcon icon={stringIconMapper[space.icon_alias || 'rocket']} size="lg" />
                                    </Avatar>
                                </Box>
                                {/* =================== Space title ========================  */}
                                <Box alignSelf='center'>
                                    {/* Note future: make this fonts responsive, use @media */}
                                    <Typography fontWeight={700} fontSize={`clamp(0.9rem, 2.5vw, 1.6rem)`} color='secondary' 
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => handleCollapseSpaceCard(space.id)}
                                    >
                                        {setMaxStringLength(space.name)}
                                    </Typography>
                                </Box>
                            </Box>
                            {/* ======================== Collapse button ======================  */}
                            <ButtonBase
                                onClick={() => handleCollapseSpaceCard(space.id)}
                                sx={{ borderRadius: '5px', padding: '3px', marginRight: '5px', ml: 'auto' }}
                            >
                                <ChevronLeftIcon
                                    color='secondary'
                                    sx={{
                                        rotate: collapsedSpaces.includes(space.id) ? '-90deg' : '90deg',
                                        transition: 'all 0.2s ease-in-out',
                                        scale: '1.1',
                                    }}
                                />
                            </ButtonBase>
                        </Box>

                        {/* ============== Habits and checkmarks =========== */}
                        <ContentCard
                            hidden={collapsedSpaces.includes(space.id)}
                            sx={{ mb: 3 }}
                        >
                            {habits.length > 0 ? (
                                <SmallScreenHabitScoreCard
                                    ownerHabits={habits}
                                    checkedDates={checkedDates}
                                    dates={dates}
                                    setCheckedDates={setCheckedDates}
                                />
                            ) : (
                                <Box sx={{ padding: '10px', textAlign: 'center' }}>
                                    No habits in this space
                                </Box>
                            )}
                        </ContentCard>
                    </Box>
                );
            })}

            {userHabitsGroupedBySpace.length === 0 && (
                <ContentCard sx={{ textAlign: 'center', padding: 3 }}>
                    <Typography>You haven't created any habits yet</Typography>
                </ContentCard>
            )}
        </Box>
    );
}