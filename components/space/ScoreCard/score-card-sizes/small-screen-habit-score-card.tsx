import { isWithinLast7Days, setMaxStringLength } from '@/lib/client-utils';
import { CheckedDatesT, HabitT, UserT } from '@/lib/types-and-constants';
import { Box, Checkbox, Typography } from '@mui/material';
import styles from './habit-score-card.module.css';
import { HabitOptionsMenu } from './HabitOptionsMenu/habit-options-menu';
import { toggleCheckmark } from './checkmark-toggle';
import DialogModal from '@/components/shared/DialogModal/dialog-modal';
import { ubuntu } from '@/styles/fonts/fonts';
import Image from 'next/image';
import checkedImage from '@/public/images/spaces/checkbox-tick.svg';
import { grey } from '@mui/material/colors';

type SmallScreenHabitScoreCardsPropsT = {
    ownerHabits: HabitT[];
    user: UserT;
    checkedDates: CheckedDatesT;
    dates: Date[];
    setCheckedDates: React.Dispatch<React.SetStateAction<CheckedDatesT>>;
};

// small function to return "week" for "W" and "month" for "M"
const timeLetterToWord = (letter : string) => letter.toLowerCase() === "m" ? "month" : letter.toLowerCase() === "w" ? "week" : letter;

export const SmallScreenHabitScoreCard = (props: SmallScreenHabitScoreCardsPropsT) => {

    const { ownerHabits, user, checkedDates, dates, setCheckedDates } = props;

    return (
        <Box
            sx={{
                display: { xs: 'grid', sm: 'none', overflow:'hidden' },
                gridTemplateColumns: '1fr ',
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
                        }}
                    >
                        {/* ============================= Habit's Title With Modal to show details ======================== */}

                        <Box component={'div'} className={styles['habit_title_container']}>
                            <DialogModal
                                key={habit.id}
                                button={
                                    <Box  sx={{ display: 'flex', alignItems: 'center' }} >
                                        <Typography title={habit.title} fontWeight={700} className={styles['habit_title']} >
                                            {setMaxStringLength(habit.title, 30)}
                                        </Typography>
                                        <Typography
                                            fontWeight={100} 
                                            fontSize='0.7em'
                                            sx={{ marginLeft: '8px' }}
                                        >
                                            {`(${habit.times}x/${timeLetterToWord(habit.time_frame)})`}
                                        </Typography>
                                    </Box>
                                }
                                childrenTitle={habit.title}
                                childrenBody={<HabitsInformationModalBody
                                    description={habit.description}
                                    times={habit.times}
                                    time_frame={habit.time_frame}
                                />}
                            />
                            {habit.owner === user.id && <HabitOptionsMenu habit={habit} />}
                        </Box>

                        {/* ============================= Habit's Checkboxes ========= */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                paddingInline: `clamp(5px, 2.5vw, 20px)`,
                                // paddingBlock: `clamp(1px, 1vw, 4px)`,
                                gap: `clamp(4px, 8vw, 8px)`,
                                justifyContent: 'space-between',
                            }}
                        >
                            {dates.map((date, i) => {
                                const checkmark = checkedDates[date.toDateString()] && checkedDates[date.toDateString()][habit.id];
                                const toggle = () => toggleCheckmark(date, habit, checkmark, setCheckedDates);
                                const isToday: boolean = date.toDateString() === new Date().toDateString();
                                const isDisabled: boolean = !isWithinLast7Days(date) || habit.owner !== user.id;

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
                                            disabled={isDisabled}
                                            checked={Boolean(checkmark)}
                                            onChange={toggle}
                                            // sets styles also of the checkmark when its disabled
                                            sx={{
                                                padding: 0,
                                                margin: 0,
                                                color: 'black',
                                                '&.Mui-disabled': {
                                                    '&.Mui-checked': {
                                                        opacity: 0.6,
                                                    },
                                                    opacity: 0.6,
                                                    backgroundColor: 'grey.200',
                                                },
                                                // '&.Mui-checked': {
                                                //     color: '#00c04b',
                                                // },
                                            }}
                                            icon={<CheckBoxWithDay date={date} isToday={isToday} isDisabled={isDisabled} />}
                                            // Checked icon
                                            checkedIcon={
                                                <Box display="flex" alignItems="center" >
                                                    <Image
                                                        src={checkedImage}
                                                        width={isToday? 40 : 30}
                                                        height={0}
                                                        alt="checked"
                                                    />
                                                </Box>
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

// Gets each checkbox design with the initials of the day of the week plus the color
const CheckBoxWithDay = ({ date, isToday, isDisabled, sx = [] }: { date: Date; isToday: boolean; isDisabled: boolean, sx?: any }) => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const day = days[date.getDay()];

    return (
        <Box
            fontSize={`clamp(13px, 4vw, 16px)`}
            fontWeight={500}
            sx={{
                border: `solid ${isToday && !isDisabled ? 'none' : grey[400]} 0.1em`,
                boxShadow: isToday && !isDisabled ? `0 0 0 2px rgba(0, 242, 157, 0.61)` : 'none',
                borderRadius: '100px',
                width: isToday? `clamp(40px, 10vw, 42px)` : `clamp(31px, 8vw, 38px)`,
                height: isToday ? `clamp(40px, 10vw, 42px)` :  `clamp(31px, 8vw, 38px)`,
                display: 'grid',
                alignItems: 'center',
                justifyContent: 'center',
                ...(sx || {}),
            }}
        >
            <Typography
                color={isToday && !isDisabled ? 'rgba(0, 242, 157, 0.61)' : 'grey.400'}
                fontWeight="700"
                fontSize={isToday ? "1.2em" : "1em"}
            >   
                {day}
            </Typography>
        </Box>
    );
};



type HabitInformationProps = {
    description: string;
    times: number;
    time_frame: string;
}

// Just the habits information shown in the modal when the habit title is clicked
const HabitsInformationModalBody = ({description, times, time_frame}: HabitInformationProps) => {

    return (
        <Box>
            {description ?
                <Typography className={ubuntu.className} >
                    <Typography component="span" className={ubuntu.className}
                        fontWeight="700"
                        color="#2385e7"
                    >
                        Description:
                    </Typography>
                    {" " + description}
                </Typography>
                :
                <Typography className={ubuntu.className}>No description to show</Typography>
            }
            <Typography className={ubuntu.className}
                sx={{ py: 2 }}
            >
                <Typography component="span" className={ubuntu.className}
                    fontWeight="700"
                    color="#2385e7"
                >
                    Frequency:
                </Typography>
                {" " + times}
                {" times per " + timeLetterToWord(time_frame)}
            </Typography>
        </Box>
    )
}
