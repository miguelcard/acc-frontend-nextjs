'use client';

import { HabitT, MembersT, UserT } from '@/lib/types-and-constants';
import { Box, Checkbox, Theme, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { checkedDatesMap, generateWeekDays } from '@/lib/client-utils';
import DatesRange from './DatesRange';
import { FullScreenTable, toggleCheckmark } from './FullScreenTable';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { SxProps } from '@mui/material-next';

type ScoreCardPropsT = { habits: HabitT[]; spaceId: number; user: UserT; members: MembersT[] };

export function ScoreCard({ habits, spaceId, user, members }: ScoreCardPropsT) {
    const today = new Date();
    const [dates, setDates] = useState(generateWeekDays(today));

    const isCheckAble: boolean = !dates.some((date) => {
        const resultantDate = date.toDateString() === today.toDateString();
        return resultantDate;
    });

    const [checkedDates, setCheckedDates] = useState<{ [key: string]: number[] }>({});

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
                                fontSize: 20,
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
                                    <FullScreenTable
                                        dates={dates}
                                        ownerHabits={ownerHabits}
                                        checkedDates={checkedDates}
                                        spaceId={spaceId}
                                        user={user}
                                        setCheckedDates={setCheckedDates}
                                        isCheckAble={isCheckAble}
                                    />
                                    <Box sx={{ display: { xs: 'grid', sm: 'none' }, gridTemplateColumns: '1fr ', gap: '10px' }}>
                                        {ownerHabits.map((habit, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    padding: '8px',
                                                    border: 'solid grey 0.5px',
                                                    borderRadius: '6px',
                                                    boxShadow: '0 6px 20px 0 #dbdbe8',
                                                }}
                                            >
                                                <Typography
                                                    fontSize={{ xs: 16, sm: 18 }}
                                                    fontWeight={{ xs: 550, sm: 600 }}
                                                    width={'100%'}
                                                    sx={{
                                                        maxWidth: '90vw',
                                                        textOverflow: 'ellipsis',
                                                        overflow: 'hidden',
                                                        marginBottom: '5px',
                                                        textTransform: 'capitalize',
                                                        borderBottom: 'solid grey 0.5px',
                                                    }}
                                                >
                                                    {habit.title}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0px',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    {dates.map((date, i) => {
                                                        const checkedDate = checkedDates[date.toDateString()];

                                                        const checkState = checkedDate ? checkedDate.includes(habit.id) : false;

                                                        const toggle = () =>
                                                            toggleCheckmark(date, habit, spaceId, checkedDates, setCheckedDates);

                                                        return (
                                                            <Box
                                                                sx={{
                                                                    display: 'grid',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                                key={i}
                                                            >
                                                                <Typography
                                                                    fontSize={`clamp(14px, 4.5vw, 17px)`}
                                                                    fontWeight={550}
                                                                    width={'100%'}
                                                                    textAlign="center"
                                                                >
                                                                    {date.toDateString().split(' ')[0].toUpperCase()}
                                                                </Typography>
                                                                <Checkbox
                                                                    disabled={isCheckAble || habit.owner !== user.id}
                                                                    checked={checkState}
                                                                    onChange={toggle}
                                                                    title={`"${habit.title}": ${date.toDateString()}`}
                                                                    sx={{
                                                                        scale: '1',
                                                                        color: 'black',
                                                                        '&.Mui-checked': {
                                                                            color: 'red',
                                                                        },
                                                                    }}
                                                                    icon={<CheckBoxWithNumber date={date} />}
                                                                    checkedIcon={
                                                                        <CheckBoxWithNumber
                                                                            date={date}
                                                                            sx={{ backgroundColor: 'red', color: 'white' }}
                                                                        />
                                                                    }
                                                                />
                                                            </Box>
                                                        );
                                                    })}
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
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

const CheckBoxWithNumber = ({ date, sx }: { date: Date; sx?: SxProps }) => (
    <Box
        fontSize={`clamp(14px, 4vw, 16px)`}
        fontWeight={500}
        sx={{
            border: 'solid grey 0.6px',
            borderRadius: '3px',
            paddingInline: '1vw',
            paddingBlock: '2.5px',
            ...sx,
        }}
    >
        {date.getDate().toString()}
    </Box>
);
