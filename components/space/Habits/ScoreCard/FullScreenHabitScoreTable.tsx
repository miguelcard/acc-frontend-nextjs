import { HabitT, UserT } from '@/lib/types-and-constants';
import {
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        paddingInline: '20px',
        paddingBlock: '10px',
        backgroundColor: theme.palette.grey[300],
        borderBottom: 'solid 1px #aaadad',
        color: theme.palette.common.black,
        position: 'sticky',
        top: 0,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        paddingInline: '15px',
        paddingBlock: '6px',
        border: '0px',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.error,
    },
    // hide last border
    '&:last-child td, &:last-child th': {},
}));

type FullScreenHabitScoreTablePropsT = {
    dates: Date[];
    ownerHabits: HabitT[];
    checkedDates: { [key: string]: number[] };
    spaceId: number;
    user: UserT;
    setCheckedDates: (arg0: { [key: string]: number[] }) => void;
    isCheckAble: boolean;
};

export const FullScreenHabitScoreTable = ({
    dates,
    ownerHabits,
    checkedDates,
    spaceId,
    user,
    setCheckedDates,
    isCheckAble,
}: FullScreenHabitScoreTablePropsT) => (
    <TableContainer component={Paper} sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Table
            sx={{
                minWidth: 700,
                padding: 0.5,
                position: 'relative',
            }}
            aria-label="Score Card"
        >
            {/* ============================= Heading */}
            <TableHead>
                <StyledTableRow>
                    <StyledTableCell align="left">
                        <Typography fontSize={`clamp(1.2rem, 4vw, 1.4rem)`} fontWeight={700} color={'darkmagenta'}>
                            Habits
                        </Typography>
                    </StyledTableCell>
                    {dates.map((day, index) => {
                        const splited = day.toDateString().split(' ');
                        return (
                            <StyledTableCell key={index} align="right">
                                <Typography fontSize={20} fontWeight={700} textTransform={'capitalize'} width={'100%'} letterSpacing={-0.4}>
                                    {splited[0]}
                                </Typography>
                                <Typography fontSize={10}>
                                    {splited[1]} {splited[2]}
                                </Typography>
                            </StyledTableCell>
                        );
                    })}
                </StyledTableRow>
            </TableHead>
            {/* ============================= body */}
            <TableBody>
                {ownerHabits.map((habit, index) => (
                    <StyledTableRow key={index}>
                        {/* ============================= Habit Title */}
                        <StyledTableCell component="th" width={'20%'} scope="row">
                            <Typography
                                fontSize={{ sm: `clamp(1rem, 3vw, 1.25rem)` }}
                                fontWeight={700}
                                width={'100%'}
                                letterSpacing={-0.4}
                                color={'black'}
                                sx={{
                                    maxWidth: { xs: '100px', md: '200px' },
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {habit.title}
                            </Typography>
                        </StyledTableCell>
                        {/* ============================= CheckMarks */}
                        {dates.map((date, i) => {
                            const checkedDate = checkedDates[date.toDateString()];

                            const checkState = checkedDate ? checkedDate.includes(habit.id) : false;

                            const toggle = () => toggleCheckmark(date, habit, spaceId, checkedDates, setCheckedDates);

                            return (
                                <StyledTableCell key={i} align="right">
                                    <Checkbox
                                        disabled={isCheckAble || habit.owner !== user.id}
                                        checked={checkState}
                                        onChange={toggle}
                                        title={`"${habit.title}": ${date.toDateString()}`}
                                        sx={{
                                            scale: { sm: '1.1', md: '1.2' },
                                            color: 'black',
                                            '&.Mui-checked': {
                                                color: 'red',
                                            },
                                        }}
                                        icon={<RadioButtonUncheckedIcon />}
                                        // checkedIcon={<CancelOutlinedIcon sx={{ color: 'red' }} />}
                                        checkedIcon={<TaskAltIcon sx={{ color: 'red' }} />}
                                    />
                                </StyledTableCell>
                            );
                        })}
                    </StyledTableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);
