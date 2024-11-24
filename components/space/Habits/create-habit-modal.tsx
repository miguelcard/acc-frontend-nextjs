import DialogModal from '@/components/shared/DialogModal/dialog-modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddRoundedIcon  from '@mui/icons-material/AddRounded';
import Image from 'next/image';
import createHabitImage from '@/public/images/spaces/create-habit-hand.svg';
import CreateHabitForm from './create-habit-form';
import { ButtonBase, Container, IconButton } from '@mui/material';
import styles from './scorecard-habits.module.css';

type CreateHabitPropsT = 
{ 
    spaceId: number;
    isFirstSpaceHabit: boolean;

};

/**
 * @param { spaceId :number }
 * The Modal for creating a Habit
 */
export default function CreateHabitModal(props: CreateHabitPropsT) {
    
    const {spaceId, isFirstSpaceHabit} = props;

    const NewHabitButton = () => (
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
            <IconButton sx={{ marginInline: 'auto' }}
                className={`${styles['new_habit_button']} ${isFirstSpaceHabit ? styles['pulse_animation'] : ''}`}
            >
                <Typography fontWeight={600} fontSize={`clamp(1rem, 4.5vw, 1.3rem)`}
                    className={`${isFirstSpaceHabit ? '' : styles['new_habit_button_text']}`}
                >
                    {isFirstSpaceHabit ? 'Add your first habit' : 'Habit'}
                </Typography>
                <AddRoundedIcon sx={{ scale: { xs: 1, sm: 1.2, md: 1.3 } }} />
            </IconButton>
        </Container>
    );

    const CreateHabitDialogTitle = () => (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Box sx={{ my: 2 }}>
                <Image src={createHabitImage} width={200} height={0} alt="habit" />
            </Box>
            <Typography fontWeight={600} fontSize="1em" pb={2}>
                Create new Habit
            </Typography>
        </Box>
    );
    return (
        <DialogModal
            button={<NewHabitButton />}
            childrenTitle={<CreateHabitDialogTitle />}
            childrenBody={<CreateHabitForm spaceId={spaceId} />}
        />
    );
}
