'use client';

import { Box, Button, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
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
function DatesRangeSelector(props: DatesRangePropsT) {

    const { dates, setDates, updateCheckedDates } = props;
    const [isNextWeekDisabled, setIsNextWeekDisabled] = useState<boolean>(true);

    const moveDatesBackward = () => {
        const firstWeekDate = new Date(dates[0]);
        firstWeekDate.setDate(firstWeekDate.getDate() - 1);
        setDates(generateWeekDays(firstWeekDate));
        const code = createWeekUUID(-6, firstWeekDate);
        updateCheckedDates(code);
        setIsNextWeekDisabled(false);
    };

    const moveDatesForward = () => {
        const lastDayOfWeek = new Date(dates[dates.length - 1]);
        lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 7);
        // Checking if the date where it is being navigated to exceeds today (this week)
        const today = new Date();
        today.setHours(0,0,0,0);
        setIsNextWeekDisabled(lastDayOfWeek >= today ? true : false);
        setDates(generateWeekDays(lastDayOfWeek));
    };

    const CurrentDate = () => setDates(generateWeekDays());

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    // marginBottom: { xs: '10px', sm: '20px' },
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 4,
                    py: 1
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        height: '100%',
                        width: '100vw'
                    }}
                >
                    {/* Jump to previous week */}
                    <ArrowButton moveDates={moveDatesBackward} title='Previous Week' isDisabled={false} sx={{ marginRight: '1px', rotate: '90deg' }} />
                    {/* Current range */}
                    <Button
                        variant="text"
                        sx={{
                            fontWeight: 600,
                            color: '#000',
                            width: '140px',
                            textTransform: 'capitalize',
                        }}
                        onClick={CurrentDate}
                    >
                        {format(dates[0], 'dd MMM')} {' \u2014 '}
                        {format(dates[6], 'dd MMM')}
                    </Button>
                    {/* jump to next week */}
                    <ArrowButton moveDates={moveDatesForward} title={'Next Week'} isDisabled={isNextWeekDisabled} sx={{ marginLeft: '1px', rotate: '-90deg' }} />
                </Box>
            </Box>
        </>
    );
}

export default DatesRangeSelector;

const ArrowButton = ({ moveDates, title, isDisabled, sx }: { moveDates: () => void; title: string, isDisabled: boolean, sx: any }) => {
    return (
        <IconButton   //replace with IconButton and disable when needed
            title={title}
            onClick={moveDates}
            disabled={isDisabled}
            size='medium'
            sx={{
                borderRadius: '5px',
                ...(sx || {}),
            }}
        >
            <ExpandCircleDownOutlinedIcon fontSize='inherit' sx={{ scale: '0.9', height: '100%' }} />
        </IconButton >
    );
};
