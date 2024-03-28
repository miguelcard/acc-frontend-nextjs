'use client';

import { Box, Button, ButtonBase, Container, IconButton } from '@mui/material';
import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { format } from 'date-fns';
import { generateWeekDays } from '@/lib/client-utils';
import { SxProps } from '@mui/material-next';

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
            <Box
                sx={{
                    display: 'flex',
                    marginBottom: '20px',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'end',
                }}
            >
                <Box
                    sx={{
                        border: 'solid gray 0.5px',
                        padding: '2px',
                        borderRadius: '7px',
                        display: 'flex',
                        // justifyContent: 'end',
                        // alignItems: 'center',
                        // width: 'fit-content',
                        boxShadow: '0px 0px 5px 1px #dbdbe8',
                        height: '100%',
                    }}
                >
                    {/* Jump to previous week */}
                    <ArrowButton moveDates={moveDatesBackward} sx={{ marginRight: '2px' }} />
                    {/* Current range */}
                    <Button
                        variant="text"
                        sx={{
                            // borderInline: 'solid gray 0.5px',
                            // borderRadius: '5px',
                            fontWeight: 700,
                            color: '#000',
                            width: '140px',
                            // '@media (max-width: 600px)': {
                            //     width: '140px',
                            // },
                        }}
                        onClick={CurrentDate}
                    >
                        {format(dates[0], 'dd MMM')} {' \u2014 '}
                        {format(dates[6], 'dd MMM')}
                        {/* {dates[6].toDateString()} */}
                    </Button>
                    {/* jump to next week */}
                    <ArrowButton moveDates={moveDatesForward} sx={{ marginLeft: '2px', rotate: '180deg' }} />
                </Box>
            </Box>
        </>
    );
}

export default DatesRange;

const ArrowButton = ({ moveDates, sx }: { moveDates: () => void; sx?: SxProps }) => {
    return (
        <ButtonBase
            title="Next week"
            onClick={moveDates}
            sx={{
                // scale: '0.6',
                // paddingInline: '2px',
                // paddingBlock: '11px',
                borderRadius: '5px',
                ...sx,
            }}
        >
            <ChevronLeftIcon sx={{ scale: '0.9', height: '100%' }} />
        </ButtonBase>
    );
};
