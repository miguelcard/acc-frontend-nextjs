'use client';

import { Space, UserT } from '@/lib/types-and-constants';
import { Box, Button, ButtonBase, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { checkedDatesMap, generateWeekDays } from '@/lib/client-utils';
import DatesRange from './ScoreCard/DatesRange';
import { FullScreenHabitScoreTable } from './ScoreCard/FullScreenHabitScoreTable';
import { SmallScreenHabitScoreCards } from './ScoreCard/SmallScreenHabitScoreCards';
import { toggleCheckmark } from './ScoreCard/CheckmarkToggle';
import { getSpaceInRangeByOwner } from '@/lib/actions';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

type ScoreCardPropsT = {
    user: UserT;
    space: Space;
};

export function ScoreCard({ user, space }: ScoreCardPropsT) {
    const { space_habits, members } = space;

    const today = new Date();
    const [dates, setDates] = useState(generateWeekDays(today));
    const [checkedDates, setCheckedDates] = useState<{ [key: string]: number[] }>({});
    const [collapsedOwners, setCollapsedOwners] = useState<number[]>([]);

    const handleCollapseHabit = (owner: number) => {
        if (collapsedOwners.includes(owner)) setCollapsedOwners((prev) => [...prev.filter((id) => id !== owner)]);
        else setCollapsedOwners([...collapsedOwners, owner]);
    };

    useEffect(() => {
        const d = checkedDatesMap(space_habits);
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
                const ownerHabits = space_habits.filter((habit) => habit.owner === owner.id);
                return (
                    <Box key={owner.id}>
                        {/* ===================================================== Owner name */}
                        <Box
                            component={'div'}
                            sx={{
                                display: 'flex',
                                gap: '5px',
                                alignItems: 'center',
                                height: '100%',
                                marginBottom: 2,
                            }}
                        >
                            <Typography
                                letterSpacing={-0.4}
                                sx={{
                                    fontSize: `clamp(1.4rem, 2.5vw, 1.6rem)`,
                                    fontWeight: 700,
                                    textTransform: 'capitalize',
                                    letterSpacing: -0.4,
                                    color: owner.id === user.id ? 'black' : 'gray',
                                }}
                            >
                                {owner.name}
                                {owner.id === user.id && ' (You)'}
                            </Typography>
                            <ButtonBase
                                onClick={() => handleCollapseHabit(owner.id)}
                                sx={{ borderRadius: '5px', padding: '3px', marginRight: '5px' }}
                            >
                                <ChevronLeftIcon
                                    sx={{
                                        rotate: collapsedOwners.includes(owner.id) ? '-90deg' : '90deg',
                                        transition: 'all 0.2s ease-in-out',
                                        scale: '1.2',
                                    }}
                                />
                            </ButtonBase>
                        </Box>
                        {/* ===================================================== Habits and checkmaks */}
                        {!collapsedOwners.includes(owner.id) && (
                            <Box
                                marginBottom={4}
                                width={'100%'}
                                flexGrow={1}
                                maxHeight={{ sm: '70vh' }}
                                overflow={'auto'}
                                border={'solid grey 0.5px'}
                                borderRadius={{ xs: '8px', sm: '7px' }}
                                boxShadow="0 6px 20px 0 #dbdbe8"
                            >
                                {ownerHabits.length > 0 ? (
                                    <>
                                        <FullScreenHabitScoreTable
                                            dates={dates}
                                            ownerHabits={ownerHabits}
                                            checkedDates={checkedDates}
                                            user={user}
                                            setCheckedDates={setCheckedDates}
                                        />
                                        <SmallScreenHabitScoreCards
                                            ownerHabits={ownerHabits}
                                            user={user}
                                            toggleCheckmark={toggleCheckmark}
                                            checkedDates={checkedDates}
                                            dates={dates}
                                            setCheckedDates={setCheckedDates}
                                        />
                                    </>
                                ) : (
                                    <Box sx={{ padding: '10px', textAlign: 'center' }}> No habits created yet</Box>
                                )}
                            </Box>
                        )}
                    </Box>
                );
            })}
        </>
    );
}
