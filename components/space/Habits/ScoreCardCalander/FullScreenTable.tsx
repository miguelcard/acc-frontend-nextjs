import { CheckMarksT, HabitT, MembersT, UserT } from '@/lib/types-and-constants';
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
import { format } from 'date-fns';
import { addCheckmark, deleteCheckmark } from '@/lib/actions';
import toast from 'react-hot-toast';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        paddingInline: '20px',
        paddingBlock: '10px',
        backgroundColor: theme.palette.grey[500],
        color: theme.palette.common.black,
        position: 'sticky',
        top: 0,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        paddingInline: '15px',
        paddingBlock: '7px',
        // border: '0px',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.grey,
    },
    // hide last border
    '&:last-child td, &:last-child th': {},
}));

type FullScreenTablePropsT = {
    dates: Date[];
    ownerHabits: HabitT[];
    checkedDates: { [key: string]: number[] };
    spaceId: number;
    user: UserT;
    setCheckedDates: (arg0: { [key: string]: number[] }) => void;
    isCheckAble: boolean;
};

export const FullScreenTable = ({
    dates,
    ownerHabits,
    checkedDates,
    spaceId,
    user,
    setCheckedDates,
    isCheckAble,
}: FullScreenTablePropsT) => (
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
            <TableHead sx={{ position: 'sticky', top: 0 }}>
                <StyledTableRow>
                    <StyledTableCell align="left">
                        <Typography fontSize="1.3em" fontWeight={700} color={'snow'}>
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
                        {/* Habit Title */}
                        <StyledTableCell component="th" width={'20%'} scope="row">
                            <Typography
                                fontSize={20}
                                fontWeight={700}
                                width={'100%'}
                                letterSpacing={-0.4}
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
                        {/* CheckMarks */}
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
                                            scale: { xs: '0.9', md: '1.2' },
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

// ========================================================== Toggle the checkmark for a specific date
export const toggleCheckmark = async (
    date: Date,
    habit: HabitT,
    spaceId: number,
    checkedDates: {
        [key: string]: number[];
    },
    setCheckedDates: React.Dispatch<
        React.SetStateAction<{
            [key: string]: number[];
        }>
    >
) => {
    const habitId = habit.id;
    const dateString = date.toDateString();
    const checkmark = habit.checkmarks.find((checkmark) => new Date(checkmark.date).toDateString() === dateString);
    const dateStr = format(date, 'yyyy-MM-dd');

    try {
        if (!checkedDates[dateString] || !checkedDates[dateString].includes(habitId)) {
            // Add checkmark
            const newCheckmark = { habit: habitId, status: 'DONE', date: dateStr };
            await toast.promise(
                addCheckmark(newCheckmark, spaceId),
                {
                    loading: 'Updating',
                    success: (res) => {
                        setCheckedDates((prevCheckedDates) => ({
                            ...prevCheckedDates,
                            [dateString]: [...(prevCheckedDates[dateString] || []), habitId],
                        }));

                        return 'Added successfully';
                    },
                    error: (error: any) => 'Failed please try again.',
                },
                { duration: 1000 }
            );
        } else {
            // Remove checkmark
            await toast.promise(
                deleteCheckmark(checkmark, spaceId),
                {
                    loading: 'Updating',
                    success: (res) => {
                        setCheckedDates((prevCheckedDates) => ({
                            ...prevCheckedDates,
                            [dateString]: prevCheckedDates[dateString].filter((id) => id !== habitId),
                        }));
                        return 'Removed successfully';
                    },
                    error: () => 'Failed please try again.',
                },
                { duration: 1000 }
            );
        }
    } catch (error) {
        console.log(`Error: ${error.message || 'Something went wrong. Please try again.'}`);
    }
};
