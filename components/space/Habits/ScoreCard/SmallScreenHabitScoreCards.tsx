import { isWithinLast7Days, setMaxStringLength } from '@/lib/client-utils';
import { HabitT, UserT } from '@/lib/types-and-constants';
import { Box, Checkbox, Tooltip, Typography } from '@mui/material';
import { SxProps } from '@mui/material-next';
import styles from '../habits.module.css';
import { HabitOptionsMenu } from '../HabitsOptions/HabitOptionsMenu';

export const SmallScreenHabitScoreCards = ({
    ownerHabits,
    user,
    toggleCheckmark,
    checkedDates,
    dates,
    setCheckedDates,
}: {
    ownerHabits: HabitT[];
    user: UserT;
    toggleCheckmark: Function;
    checkedDates: {
        [key: string]: number[];
    };
    dates: Date[];
    setCheckedDates: Function;
}) => {
    return (
        <Box
            sx={{
                display: { xs: 'grid', sm: 'none' },
                gridTemplateColumns: '1fr ',
                // gap: `clamp(4px, 2vw, 4px)`
            }}
        >
            {ownerHabits
                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                .map((habit, index) => (
                    <Box
                        key={index}
                        sx={{
                            padding: `clamp(6px, 3vw, 10px)`,
                            width: '100%',
                            // border: 'solid grey 0.5px',
                            // borderBottom: 'dashed grey 0.5px',

                            // borderRadius: '6px',
                            // boxShadow: '0 6px 20px 0 #dbdbe8',
                        }}
                    >
                        {/* ============================= Habit's Title HTs */}
                        <Box component={'div'} className={styles['habit_title_container']}>
                            <Typography title={habit.title} className={styles['habit_title']}>
                                {setMaxStringLength(habit.title, 25).toLowerCase()}
                            </Typography>
                            {habit.owner === user.id && <HabitOptionsMenu habit={habit} />}
                        </Box>
                        {/* ============================= Habit's Checkboxes HCs */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                paddingInline: `clamp(5px, 2.5vw, 20px)`,
                                paddingBlock: `clamp(3px, 2vw, 6px)`,
                                gap: `clamp(4px, 8vw, 8px)`,
                                justifyContent: 'space-between',
                            }}
                        >
                            {dates.map((date, i) => {
                                const checkedDate = checkedDates[date.toDateString()];

                                const checkState = checkedDate ? checkedDate.includes(habit.id) : false;

                                const toggle = () => toggleCheckmark(date, habit, checkedDates, setCheckedDates);

                                return (
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        key={i}
                                    >
                                        <Checkbox
                                            title={`"${habit.title}": ${date.toDateString()}`}
                                            disabled={isWithinLast7Days(date) || habit.owner !== user.id}
                                            checked={checkState}
                                            onChange={toggle}
                                            sx={{
                                                padding: 0,
                                                margin: 0,
                                                color: 'black',
                                                '&.Mui-disabled': {
                                                    '&.Mui-checked': {
                                                        opacity: 0.5,
                                                    },
                                                    opacity: 0.5,
                                                },
                                                '&.Mui-checked': {
                                                    color: '#00c04b',
                                                },
                                            }}
                                            icon={<CheckBoxWithNumber date={date} />}
                                            checkedIcon={
                                                <CheckBoxWithNumber
                                                    date={date}
                                                    sx={{
                                                        backgroundColor: '#00c04b',
                                                        color: 'white',
                                                    }}
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
    );
};

const CheckBoxWithNumber = ({ date, sx }: { date: Date; sx?: SxProps }) => {
    const days = ['Su', 'Mn', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const day = days[date.getDay()];
    const isToday = date.toDateString() === new Date().toDateString();

    return (
        <Box
            fontSize={`clamp(13px, 4vw, 16px)`}
            fontWeight={500}
            sx={{
                border: `solid ${isToday ? '#655dff' : 'grey'} 0.9px`,
                borderRadius: '100px',
                width: `clamp(30px, 8vw, 38px)`,
                height: `clamp(30px, 8vw, 38px)`,
                display: 'grid',
                alignItems: 'center',
                justifyContent: 'center',
                color: isToday ? '#655dff' : 'black',
                padding: '4px',
                ...sx,
            }}
        >
            {day}
        </Box>
    );
};

/* dates as title 

<Typography
    fontSize={`clamp(14px, 4.5vw, 17px)`}
    color="#000"
    fontWeight={550}
    width={'100%'}
    textAlign="center"
    >
        {date.toDateString().split(' ')[0].toUpperCase()}
</Typography> */
