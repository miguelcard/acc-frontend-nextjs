'use client';

import { CheckedDatesT, HabitT, MembersT, UserT } from '@/lib/types-and-constants';
import { Box, ButtonBase, Typography } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import { checkedDatesMap, createWeekUUID, generateWeekDays } from '@/lib/client-utils';
import DatesRange from './ScoreCard/dates-range';
import { FullScreenHabitScoreCard } from './ScoreCard/full-screen-habit-score-card';
import { SmallScreenHabitScoreCard } from './ScoreCard/small-screen-habit-score-card';
import { getAllHabitsAndCheckmarksFromSpace } from '@/lib/actions';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

type ScoreCardPropsT = {
    user: UserT;
    spaceHabits: HabitT[];
    members: MembersT[];
    spaceId: number;
};

export function ScoreCard({ user, spaceHabits, members, spaceId }: ScoreCardPropsT) {
    // ============================= States initialization prepration
    const weedDays = useMemo(() => generateWeekDays(), []);
    const newCheckedDates = useCallback((spaceHabits: HabitT[]) => checkedDatesMap(spaceHabits), []);
    const todayUUID = useMemo(() => createWeekUUID(), []);

    // ============================= States declaration and initialization
    const [dates, setDates] = useState(weedDays);
    const [checkedDates, setCheckedDates] = useState<CheckedDatesT>(newCheckedDates(spaceHabits));
    const [collapsedOwners, setCollapsedOwners] = useState<number[]>([]);

    // ============================= Collapse owners
    const handleCollapseOwners = (owner: number) => {
        if (collapsedOwners.includes(owner)) setCollapsedOwners((prev) => [...prev.filter((id) => id !== owner)]);
        else setCollapsedOwners([...collapsedOwners, owner]);
    };

    // ============================= Getting owners and shifting order for current user
    const owners = members.map((member) => {
        return { id: member.id, name: member.username };
    });

    const userIndex = owners.findIndex((owner) => owner.id === user.id);
    if (userIndex > -1) owners.splice(userIndex, 1);
    owners.unshift({ id: user.id, name: user.username });

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
            <DatesRange dates={dates} setDates={setDates} updateCheckedDates={updateCheckedDates} />
            {owners.map((owner) => {
                const ownerHabits = spaceHabits.filter((habit) => habit.owner === owner.id);
                return (
                    <Box key={owner.id}>
                        {/* =========================================== Owner name */}
                        <Box
                            component={'div'}
                            sx={{
                                display: 'hidden',
                                gap: '5px',
                                alignItems: 'center',
                                height: '100%',
                                marginBottom: 2,
                                color: owner.id === user.id ? 'black' : 'gray',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: `clamp(1.4rem, 2.5vw, 1.6rem)`,
                                    fontWeight: 700,
                                    textTransform: 'capitalize',
                                    letterSpacing: -0.4,
                                }}
                            >
                                {owner.name}
                                {owner.id === user.id && ' (You)'}
                            </Typography>
                            {/* ===================================================== Collapse button */}
                            <ButtonBase
                                onClick={() => handleCollapseOwners(owner.id)}
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
                        {/* =========================================== Habits and checkmaks */}
                        <Box
                            hidden={collapsedOwners.includes(owner.id)}
                            marginBottom={4}
                            width={'100%'}
                            flexGrow={1}
                            maxHeight={{ sm: '70vh' }}
                            overflow={'auto'}
                            border={'solid grey 0.5px'}
                            borderRadius={'8px'}
                            boxShadow="0 6px 20px 0 #dbdbe8"
                        >
                            {ownerHabits.length > 0 ? (
                                <>
                                    <FullScreenHabitScoreCard
                                        dates={dates}
                                        ownerHabits={ownerHabits}
                                        checkedDates={checkedDates}
                                        user={user}
                                        setCheckedDates={setCheckedDates}
                                    />
                                    <SmallScreenHabitScoreCard
                                        ownerHabits={ownerHabits}
                                        user={user}
                                        checkedDates={checkedDates}
                                        dates={dates}
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
