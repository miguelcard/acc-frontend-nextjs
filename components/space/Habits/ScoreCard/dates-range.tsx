'use client';

import { Box, Button, ButtonBase, Typography } from '@mui/material';
import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { format } from 'date-fns';
import { createWeekUUID, generateWeekDays } from '@/lib/client-utils';

type DatesRangePropsT = {
    dates: Date[];
    // eslint-disable-next-line no-unused-vars
    setDates: (value: React.SetStateAction<Date[]>) => void;
    // eslint-disable-next-line no-unused-vars
    updateCheckedDates: (DateRangeCode: string) => Promise<void>;
};

/**
 * DatesRange is a component for navigating week-based calendars.
 * It lets users move back, forward, or to the current week.
 * Includes formatted dates and navigation buttons.
 * @param dates is an array of dates representing the current week
 * @param setDates is a function to set the current week
 * @param updateCheckedDates is a function to test the current week api
 * @return React.JSX.Element
 */
function DatesRange(props: DatesRangePropsT) {
    const { dates, setDates, updateCheckedDates } = props;

    const moveDatesBackward = () => {
        const firstDate = new Date(dates[0]);
        firstDate.setDate(firstDate.getDate() - 1);
        setDates(generateWeekDays(firstDate));
        const code = createWeekUUID(-6, firstDate);
        updateCheckedDates(code);
    };

    const moveDatesForward = () => {
        const lastDate = new Date(dates[dates.length - 1]);
        lastDate.setDate(lastDate.getDate() + 7);
        setDates(generateWeekDays(lastDate));
    };

    const CurrentDate = () => setDates(generateWeekDays());

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    marginBottom: { xs: '10px', sm: '20px' },
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography
                    sx={{
                        fontSize: `clamp(1.3rem, 3vw, 1.8rem)`,
                        fontWeight: 800,
                        textTransform: 'capitalize',
                        letterSpacing: -0.8,
                    }}
                >
                    Members
                </Typography>
                <Box
                    sx={{
                        border: 'solid gray 0.5px',
                        padding: '2px',
                        borderRadius: '7px',
                        display: 'flex',

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
                            fontWeight: 700,
                            color: '#000',
                            width: '140px',
                        }}
                        onClick={CurrentDate}
                    >
                        {format(dates[0], 'dd MMM')} {' \u2014 '}
                        {format(dates[6], 'dd MMM')}
                    </Button>
                    {/* jump to next week */}
                    <ArrowButton moveDates={moveDatesForward} sx={{ marginLeft: '2px', rotate: '180deg' }} />
                </Box>
            </Box>
        </>
    );
}

export default DatesRange;

const ArrowButton = ({ moveDates, sx }: { moveDates: () => void; sx: any }) => {
    return (
        <ButtonBase
            title="Next week"
            onClick={moveDates}
            sx={{
                borderRadius: '5px',
                ...(sx || {}),
            }}
        >
            <ChevronLeftIcon sx={{ scale: '0.9', height: '100%' }} />
        </ButtonBase>
    );
};
