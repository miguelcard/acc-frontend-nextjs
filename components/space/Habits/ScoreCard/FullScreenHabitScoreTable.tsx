import { HabitT, UserT } from '@/lib/types-and-constants';
import {
    Box,
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    tableCellClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { toggleCheckmark } from './CheckmarkToggle';
import { isWithinLast7Days, setMaxStringLength } from '@/lib/client-utils';
import styles from '../habits.module.css';
import { HabitOptionsMenu } from '../HabitsOptions/HabitOptionsMenu';

export const FullScreenHabitScoreTable = ({ dates, ownerHabits, checkedDates, user, setCheckedDates }: FullScreenHabitScoreTablePropsT) => (
    <TableContainer component={Paper} sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Table
            sx={{
                minWidth: 700,
                padding: 0.5,
                position: 'relative',
            }}
            aria-label="Score Card"
        >
            {/* ============================= Heading HHf */}
            <TableHead>
                <StyledTableRow>
                    <StyledTableCell align="left">
                        <Typography fontSize={`clamp(1.2rem, 4vw, 1.4rem)`} fontWeight={700} color={'black'}>
                            Habits
                        </Typography>
                    </StyledTableCell>
                    {dates.map((date, index) => {
                        const isToday = date.toDateString() === new Date().toDateString();

                        const splited = date.toDateString().split(' ');
                        return (
                            <StyledTableCell key={index} align="right">
                                <Typography
                                    fontSize={20}
                                    fontWeight={700}
                                    color={isToday ? 'secondary' : '#fff'}
                                    textTransform={'capitalize'}
                                    width={'100%'}
                                    letterSpacing={-0.4}
                                >
                                    {splited[0]}
                                </Typography>
                                <Typography fontSize={10} color={isToday ? '#655dff' : '#fff'}>
                                    {splited[1]} {splited[2]}
                                </Typography>
                            </StyledTableCell>
                        );
                    })}
                </StyledTableRow>
            </TableHead>

            {/* ============================= body HTf */}
            <TableBody>
                {ownerHabits
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                    .map((habit, index) => {
                        return (
                            <StyledTableRow key={index}>
                                {/* ============================= Habit Title HTf */}
                                <StyledTableCell component="th" scope="row">
                                    <Box component={'div'} className={styles['habit_title_container']}>
                                        <Typography className={styles['habit_title']} title={habit.title}>
                                            {setMaxStringLength(habit.title, 20)}
                                        </Typography>
                                        {habit.owner === user.id && <HabitOptionsMenu habit={habit} />}
                                    </Box>
                                </StyledTableCell>
                                {/* ============================= CheckMarks HCf */}
                                {dates.map((date, i) => {
                                    const checkedDate = checkedDates[date.toDateString()];

                                    const checkState = checkedDate ? checkedDate.includes(habit.id) : false;

                                    const toggle = () => toggleCheckmark(date, habit, checkedDates, setCheckedDates);

                                    return (
                                        <StyledTableCell key={i} align="right">
                                            <Checkbox
                                                title={`"${habit.title}": ${date.toDateString()}`}
                                                disabled={isWithinLast7Days(date) || habit.owner !== user.id}
                                                checked={checkState}
                                                onChange={toggle}
                                                sx={{
                                                    scale: { sm: '1.1', md: '1.2' },
                                                    color: 'black',
                                                    '&.Mui-disabled': {
                                                        '&.Mui-checked': {
                                                            opacity: 0.5,
                                                        },
                                                    },
                                                    '&.Mui-checked': {
                                                        color: '#00c04b',
                                                    },
                                                }}
                                                icon={<RadioButtonUncheckedIcon />}
                                                // checkedIcon={<CancelOutlinedIcon sx={{ color: '#00c04b' }} />}
                                                checkedIcon={<TaskAltIcon />}
                                            />
                                        </StyledTableCell>
                                    );
                                })}
                            </StyledTableRow>
                        );
                    })}
            </TableBody>
        </Table>
    </TableContainer>
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        paddingInline: '20px',
        paddingBlock: '10px',
        backgroundColor: theme.palette.grey[400],
        borderBottom: 0,
        color: theme.palette.common.black,
        position: 'sticky',
        top: 0,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        paddingInline: '15px',
        paddingBlock: '6px',
        // border: 0
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // '&:nth-of-type(odd)': {
    //     backgroundColor: theme.palette.error,
    // },
    // hide last border
    // '&:last-child th': { borderBottom: 0 },
}));

type FullScreenHabitScoreTablePropsT = {
    dates: Date[];
    ownerHabits: HabitT[];
    checkedDates: { [key: string]: number[] };
    user: UserT;
    setCheckedDates: (arg0: { [key: string]: number[] }) => void;
};
