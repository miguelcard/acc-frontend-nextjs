import { HabitT, MembersT, UserT } from '@/lib/types-and-constants';
import { Box, Checkbox, Theme, Typography } from '@mui/material';
import { SxProps } from '@mui/material-next';

export const SmallScreenHabitScoreCards = ({
    ownerHabits,
    user,
    toggleCheckmark,
    checkedDates,
    dates,
    setCheckedDates,
    spaceId,
    isCheckAble,
}: {
    ownerHabits: HabitT[];
    user: UserT;
    toggleCheckmark: Function;
    checkedDates: {
        [key: string]: number[];
    };
    dates: Date[];
    setCheckedDates: Function;
    spaceId: number;
    isCheckAble: boolean;
}) => {
    return (
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
                    {/* ============================= Habit's Title */}
                    <Typography
                        fontSize={`clamp(14px, 4.5vw, 18px)`}
                        fontWeight={650}
                        width={'100%'}
                        color={'darkmagenta'}
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

                    {/* ============================= Habit's Checkboxes */}
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

                            const toggle = () => toggleCheckmark(date, habit, spaceId, checkedDates, setCheckedDates);

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
                                        color="#000"
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
                                                sx={{
                                                    backgroundColor: 'red',
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

const CheckBoxWithNumber = ({ date, sx }: { date: Date; sx?: SxProps }) => (
    <Box
        fontSize={`clamp(14px, 4vw, 16px)`}
        fontWeight={500}
        sx={{
            border: 'solid grey 0.6px',
            borderRadius: '3px',
            paddingInline: '0.9vw',
            paddingBlock: '2.5px',
            ':disabled': {
                backgroundColor: 'white',
            },
            ...sx,
        }}
    >
        {date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}
    </Box>
);
