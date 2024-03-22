'use client';

import { HabitT, MembersT, UserT } from '@/lib/types-and-constants';
import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { checkedDatesMap, generateWeekDays } from '@/lib/client-utils';
import DatesRange from './ScoreCard/DatesRange';
import { FullScreenHabitScoreTable } from './ScoreCard/FullScreenHabitScoreTable';
import { SmallScreenHabitScoreCards } from './ScoreCard/SmallScreenHabitScoreCards';
import { toggleCheckmark } from './ScoreCard/CheckmarkToggle';

type ScoreCardPropsT = { habits: HabitT[]; spaceId: number; user: UserT; members: MembersT[] };

export function ScoreCard({ habits, spaceId, user, members }: ScoreCardPropsT) {
    const today = new Date();
    const [dates, setDates] = useState(generateWeekDays(today));
    const [checkedDates, setCheckedDates] = useState<{ [key: string]: number[] }>({});

    const isCheckAble: boolean = !dates.some((date) => {
        const resultantDate = date.toDateString() === today.toDateString();
        return resultantDate;
    });

    useEffect(() => {
        const d = checkedDatesMap(habits);
        setCheckedDates(d);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ============================= Getting owners and shifting order for current user
    const owners = members.map((member) => {
        return { id: member.id, name: member.username };
    });
    const userIndex = owners.findIndex((owner) => owner.id === user.id);
    if (userIndex > -1) owners.splice(userIndex, 1);
    owners.unshift({ id: user.id, name: user.username });

    return (
        <>
            <DatesRange dates={dates} setDates={setDates} />
            {owners.map((owner) => {
                const ownerHabits = habits.filter((habit) => habit.owner === owner.id);
                return (
                    <Box key={owner.id}>
                        {/* ===================================================== Owner name */}
                        <Typography
                            letterSpacing={-0.4}
                            sx={{
                                marginBottom: 2,
                                fontSize: `clamp(1.4rem, 2.5vw, 1.6rem)`,
                                fontWeight: 700,
                                textTransform: 'capitalize',
                                letterSpacing: -0.4,
                                color: owner.id === user.id ? 'gray' : 'black',
                            }}
                        >
                            {owner.name}
                            {owner.id === user.id && ' (You)'}
                        </Typography>
                        {/* ===================================================== Habits and checkmaks */}
                        <Box
                            marginBottom={4}
                            width={'100%'}
                            flexGrow={1}
                            maxHeight={{ sm: '70vh' }}
                            overflow={'auto'}
                            border={{ xs: 'none', sm: 'solid grey 0.5px' }}
                            // borderBottom={{ xs: 'solid grey 0.5px' }}
                            borderRadius={{ sm: '7px' }}
                        >
                            {ownerHabits.length > 0 ? (
                                <>
                                    <FullScreenHabitScoreTable
                                        dates={dates}
                                        ownerHabits={ownerHabits}
                                        checkedDates={checkedDates}
                                        spaceId={spaceId}
                                        user={user}
                                        setCheckedDates={setCheckedDates}
                                        isCheckAble={isCheckAble}
                                    />
                                    <SmallScreenHabitScoreCards
                                        ownerHabits={ownerHabits}
                                        user={user}
                                        toggleCheckmark={toggleCheckmark}
                                        checkedDates={checkedDates}
                                        dates={dates}
                                        spaceId={spaceId}
                                        isCheckAble={isCheckAble}
                                        setCheckedDates={setCheckedDates}
                                    />
                                </>
                            ) : (
                                <Box sx={{ padding: '10px', textAlign: 'center' }}> No habits created yet</Box>
                            )}
                        </Box>
                    </Box>
                );
            })}
        </>
    );
}
