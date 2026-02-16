'use client';

import { HabitT, MemberT, UserT } from '@/lib/types-and-constants';
import { Box, ButtonBase, Divider, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import DatesRangeSelector from './dates-range-selector';
import { SmallScreenHabitScoreCard } from './score-card-sizes/small-screen-habit-score-card';
import { getAllHabitsAndCheckmarksFromSpace } from '@/lib/actions';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { ubuntu } from '@/styles/fonts/fonts';
import UserAvatar from '@/components/shared/UserAvatar/user-avatar';
import ContentCard from '@/components/shared/ContentCard/content-card';
import { useHabitScorecard } from '@/lib/hooks/useHabitScorecard';

type ScoreCardPropsT = {
    currentUser: UserT;
    spaceHabits: HabitT[];
    members: MemberT[];
    spaceId: number;
};

export function ScoreCard({ currentUser, spaceHabits, members, spaceId }: ScoreCardPropsT) {

    // Use shared hook for scorecard logic on dates and checkmarks
    const { dates, setDates, checkedDates, setCheckedDates, updateCheckedDates } = 
        useHabitScorecard(spaceHabits);
        
    // ============================= Collapse state (specific to this view)
    const [collapsedOwners, setCollapsedOwners] = useState<number[]>([]);

    const handleCollapseMemberScoreCard = (memberId: number) => {
        if (collapsedOwners.includes(memberId)) {
            setCollapsedOwners((prev) => [...prev.filter((id) => id !== memberId)]);
        } else {
            setCollapsedOwners([...collapsedOwners, memberId]);
        }
    };

    // ================= Getting members and shifting order for current user

    const orderedMembers = useMemo(() => {
        const membersCopy = [...members];
        const currentUserIndex = membersCopy.findIndex((user) => user.id === currentUser.id);

        if (currentUserIndex > 0) {
            // Remove the current user from their current position
            const [currentUser] = membersCopy.splice(currentUserIndex, 1);
            // Add the current user to the beginning of the list
            membersCopy.unshift(currentUser);
        }

        return membersCopy;
    }, [members, currentUser.id]);


    // Wrapper to handle date range updates
    const handleDateRangeUpdate = async (dateRangeCode: string) => {
        await updateCheckedDates(dateRangeCode, async (code) => {
            const res = await getAllHabitsAndCheckmarksFromSpace(spaceId, code);
            return res.results;
        });
    };

    return (
        <>
            <DatesRangeSelector dates={dates} setDates={setDates} updateCheckedDates={handleDateRangeUpdate} />
            {orderedMembers.map((member) => {
                const ownerHabits = spaceHabits?.filter((habit) => habit.owner === member.id);
                return (
                    <Box key={member.id}>
                        {/* =========================================== Owner name */}
                        <Box
                            component={'div'}
                            sx={{
                                display: 'flex',
                                width: '100%',
                                gap: '5px',
                                alignItems: 'center',
                                height: '100%',
                                marginBottom: 0.5,
                                color: member.id === currentUser.id ? 'black' : 'gray',
                                marginX: 1
                            }}
                        >
                            {/* avatar picture or initials of the user in his scorecard */}
                            <Box mx={1}>
                                <UserAvatar user={member} circleDiameter={28} initialsFontSize="0.9rem" initialsFontWeight={500} />
                            </Box>
                            {/* username on top of the scorecard */}
                            <Typography
                                className={ubuntu.className}
                                // color= {member.id === currentUser.id ? 'secondary' : 'grey.600'}
                                onClick={() => handleCollapseMemberScoreCard(member.id)}
                                sx={{
                                    fontSize: `clamp(1rem, 2.5vw, 1.6rem)`,
                                    fontWeight: 500,
                                    letterSpacing: -0.4,
                                    cursor: 'pointer',
                                }}
                            >
                                {member.username}
                                {member.id === currentUser.id && ' (you)'}
                            </Typography>
                            {/* ======== Collapse arrow button ====== */}
                            <ButtonBase
                                onClick={() => handleCollapseMemberScoreCard(member.id)}
                                sx={{ borderRadius: '5px', padding: '3px', marginRight: '5px', ml: 'auto' }}
                            >
                                <ChevronLeftIcon
                                    sx={{
                                        rotate: collapsedOwners.includes(member.id) ? '-90deg' : '90deg',
                                        transition: 'all 0.2s ease-in-out',
                                        scale: '1.1',
                                        // color: member.id === currentUser.id ? 'secondary.main' : 'grey.600'
                                    }}
                                />
                            </ButtonBase>
                        </Box>
                        {/* ============== Habits and checkmaks =========== */}
                        <ContentCard hidden={collapsedOwners.includes(member.id)} sx={{mb: 3}} >
                            {ownerHabits.length > 0 ? (
                                <>
                                    {/* disabled for now KISS, priority would be mobile view for now */}
                                    {/* <FullScreenHabitScoreCard
                                        dates={dates}
                                        ownerHabits={ownerHabits}
                                        checkedDates={checkedDates}
                                        user={currentUser}
                                        setCheckedDates={setCheckedDates}
                                    /> */}
                                    <SmallScreenHabitScoreCard
                                        ownerHabits={ownerHabits}
                                        user={currentUser}
                                        checkedDates={checkedDates}
                                        dates={dates}
                                        setCheckedDates={setCheckedDates}
                                    />
                                </>
                            ) : (
                                <Box sx={{ padding: '10px', textAlign: 'center' }}> No habits created yet</Box>
                            )}
                        </ContentCard>
                        
                        {/* Divider below the scorecard */}
                        {collapsedOwners.includes(member.id) && (
                            <Divider sx={{ my: 1, mx: 2 }} />
                        )}
                    </Box>
                );
            })}
        </>
    );
}
