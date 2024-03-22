'use client';

import { Box, Button, Container, IconButton } from '@mui/material';
import React from 'react';
import ArrowBackIosNewTwoToneIcon from '@mui/icons-material/ArrowBackIosNewTwoTone';
import ArrowForwardIosTwoToneIcon from '@mui/icons-material/ArrowForwardIosTwoTone';
import { format } from 'date-fns';
import { generateWeekDays } from '@/lib/client-utils';

type DatesRangePropsT = {
    dates: Date[];
    setDates: (value: React.SetStateAction<Date[]>) => void;
};

function DatesRange(props: DatesRangePropsT) {
    const { dates, setDates } = props;
    const today = new Date();

    const moveDatesBackward = () => {
        const newDates = [...dates];
        const firstDate = newDates[0];
        const newFirstDate = new Date(firstDate);
        newFirstDate.setDate(newFirstDate.getDate() - 1);
        const generatedDates = generateWeekDays(newFirstDate);
        setDates(generatedDates);
    };

    const moveDatesForward = () => {
        const newDates = [...dates];
        const lastDate = newDates[newDates.length - 1];
        const newEndDate = new Date(lastDate);
        newEndDate.setDate(newEndDate.getDate() + 7);
        const generatedDates = generateWeekDays(newEndDate);
        setDates(generatedDates);
    };

    const CurrentDate = () => setDates(generateWeekDays(today));

    return (
        <>
            <Container
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginBottom: '20px',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'end',
                    overflow: 'hidden',
                    fontSize: '0.9em',
                }}
            >
                <Box
                    sx={{
                        border: 'solid gray 0.5px',
                        borderRadius: '5px',
                        padding: '2px',
                        display: 'flex',
                        justifyContent: 'end',
                        alignItems: 'center',
                        width: 'fit-content',
                    }}
                >
                    {/* Jump to previous week */}
                    <IconButton
                        title="Previous week"
                        sx={{
                            paddingInline: '1px',
                            paddingBlock: '6px',
                            borderRadius: '5px',
                            marginRight: '3px',
                            height: '100%',
                        }}
                        onClick={moveDatesBackward}
                    >
                        <ArrowBackIosNewTwoToneIcon sx={{ height: '20px' }} />
                    </IconButton>
                    {/* Current range */}
                    <Button
                        variant="text"
                        sx={{
                            borderInline: 'solid gray 0.5px',
                            borderRadius: '5px',
                            fontWeight: 700,
                            color: '#000',
                            width: '230px',
                            '@media (max-width: 600px)': {
                                width: '200px',
                            },
                        }}
                        onClick={CurrentDate}
                    >
                        {format(dates[0], 'dd-MMM-yy')} {' \u2014 '}
                        {format(dates[6], 'dd-MMM-yy')}
                        {/* {dates[6].toDateString()} */}
                    </Button>
                    {/* jump to next week */}
                    <IconButton
                        title="Next week"
                        onClick={moveDatesForward}
                        sx={{
                            paddingInline: '1px',
                            paddingBlock: '6px',
                            borderRadius: '5px',
                            marginLeft: '3px',
                            height: '100%',
                        }}
                    >
                        <ArrowForwardIosTwoToneIcon sx={{ height: '20px' }} />
                    </IconButton>
                </Box>
            </Container>
        </>
    );
}

export default DatesRange;
