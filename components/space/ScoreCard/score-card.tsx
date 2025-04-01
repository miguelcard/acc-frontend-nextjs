'use client';

import { CheckedDatesT, HabitT, MemberT, UserT } from '@/lib/types-and-constants';
import { Avatar, Box, ButtonBase, Typography } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { checkedDatesMap, createWeekUUID, generateWeekDays } from '@/lib/client-utils';
import DatesRangeSelector from './dates-range-selector';
import { FullScreenHabitScoreCard } from './score-card-sizes/full-screen-habit-score-card'
import { SmallScreenHabitScoreCard } from './score-card-sizes/small-screen-habit-score-card';
import { getAllHabitsAndCheckmarksFromSpace } from '@/lib/actions';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { ubuntu } from '@/styles/fonts/fonts';
import UserAvatar from '@/components/shared/UserAvatar/user-avatar';
import ContentCard from '@/components/shared/ContentCard/content-card';

type ScoreCardPropsT = {
    currentUser: UserT;
    spaceHabits: HabitT[];
    members: MemberT[];
    spaceId: number;
};

export function ScoreCard({ currentUser, spaceHabits, members, spaceId }: ScoreCardPropsT) {
    // ============================= States initialization prepration
    const weedDays = useMemo(() => generateWeekDays(), []);
    const newCheckedDates = useCallback((spaceHabits: HabitT[]) => checkedDatesMap(spaceHabits), []);
    const todayUUID = useMemo(() => createWeekUUID(), []);

    // ============================= States declaration and initialization
    const [dates, setDates] = useState(weedDays);
    const [checkedDates, setCheckedDates] = useState<CheckedDatesT>(newCheckedDates(spaceHabits));
    const [collapsedOwners, setCollapsedOwners] = useState<number[]>([]);

    // ============================= Collapse owners
    const handleCollapseMemberScoreCard = (memberId: number) => {
        if (collapsedOwners.includes(memberId)) setCollapsedOwners((prev) => [...prev.filter((id) => id !== memberId)]);
        else setCollapsedOwners([...collapsedOwners, memberId]);
    };

    // ============================= Getting members and shifting order for current user

    const currentUserIndex = members.findIndex((user) => user.id === currentUser.id);

    if (currentUserIndex > 0) {
        // Remove the current user from their current position
        const [currentUser] = members.splice(currentUserIndex, 1);
        // Add the current user to the beginning of the list
        members.unshift(currentUser);
    }

    // ============================= Getting new habits and updating checked dates
    const [datesFetched, setDatesFetched] = useState([todayUUID]);

    /**
     * @param DateRangeCode string containing cm_to_date and cm_from_date which are range of date for checkmaks pagination
     */
    const updateCheckedDates = async (DateRangeCode: string) => {
        if (!datesFetched.includes(DateRangeCode)) {
            let res: any;
            res = await getAllHabitsAndCheckmarksFromSpace(spaceId, DateRangeCode);
            setDatesFetched((prev) => [...prev, DateRangeCode]);

            const fetchCheckedDates = checkedDatesMap(res.results);
            setCheckedDates((prev) => ({ ...prev, ...fetchCheckedDates }));
        }
    };

    return (
        <>
            <DatesRangeSelector dates={dates} setDates={setDates} updateCheckedDates={updateCheckedDates} />
            {members.map((member) => {
                const ownerHabits = spaceHabits.filter((habit) => habit.owner === member.id);
                return (
                    <Box key={member.id}>
                        {/* =========================================== Owner name */}
                        <Box
                            component={'div'}
                            sx={{
                                display: 'hidden',
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
                                sx={{
                                    fontSize: `clamp(1rem, 2.5vw, 1.6rem)`,
                                    fontWeight: 500,
                                    letterSpacing: -0.4,
                                }}
                            >
                                {member.username}
                                {member.id === currentUser.id && ' (you)'}
                            </Typography>
                            {/* ======== Collapse arrow button ====== */}
                            <ButtonBase
                                onClick={() => handleCollapseMemberScoreCard(member.id)}
                                sx={{ borderRadius: '5px', padding: '3px', marginRight: '5px' }}
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
                                    <FullScreenHabitScoreCard
                                        dates={dates}
                                        ownerHabits={ownerHabits}
                                        checkedDates={checkedDates}
                                        user={currentUser}
                                        setCheckedDates={setCheckedDates}
                                    />
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
                    </Box>
                );
            })}
        </>
    );
}
