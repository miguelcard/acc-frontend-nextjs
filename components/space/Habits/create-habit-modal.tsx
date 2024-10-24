import DialogModal from '@/components/shared/DialogModal/dialog-modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';

import habitsImg from '@/public/images/spaces/habits.jpg';
import CreateHabitForm from './create-habit-form';
import { ButtonBase, Container } from '@mui/material';
import styles from './scorecard-habits.module.css';

type CreateHabitPropsT = { spaceId: number };

/**
 * @param { spaceId :number }
 * The Modal for creating a Habit
 */
export default function CreateHabitModal(props: CreateHabitPropsT) {
    const NewHabitButton = () => (
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
            <ButtonBase color="secondary" sx={{ marginInline: 'auto' }} className={styles['new_habit_button']}>
                <Typography fontWeight={600} fontSize={`clamp(1rem, 4.5vw, 1.3rem)`} className={styles['new_habit_button_text']}>
                    Habit
                </Typography>
                <AddIcon sx={{ scale: { xs: 1, sm: 1.2, md: 1.3 } }} />
            </ButtonBase>
        </Container>
    );

    const CreateHabitDialogTitle = () => (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <Image src={habitsImg} width={120} height={0} alt="logo" />
            <Typography fontWeight={600} fontSize="1em" pb={2}>
                Create new Habit
            </Typography>
        </Box>
    );
    return (
        <DialogModal
            button={<NewHabitButton />}
            childrenTitle={<CreateHabitDialogTitle />}
            childrenBody={<CreateHabitForm spaceId={props.spaceId} />}
        />
    );
}
