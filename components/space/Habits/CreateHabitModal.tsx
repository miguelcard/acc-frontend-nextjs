import DialogModal from '@/components/shared/DialogModal/dialog-modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';

import habitsImg from '../../../public/images/spaces/habits.jpg';
import CreateHabitForm from './CreateHabitForm';

type CreateHabitPropsT = { spaceId: number };

/**
 * @param { spaceId :number }
 * The Modal for creating a Habit
 */
export default function CreateHabitModel(props: CreateHabitPropsT) {
    return (
        <>
            <DialogModal
                button={<NewHabitButton />}
                childrenTitle={<CreateHabitDialogTitle />}
                childrenBody={<CreateHabitForm spaceId={props.spaceId} />}
            />
        </>
    );
}

const NewHabitButton = () => {
    return (
        <Button
            variant="outlined"
            color="secondary"
            sx={{ marginInline: 'auto' }}
            startIcon={
                <>
                    <AddIcon />
                </>
            }
        >
            <Typography fontWeight={600} fontSize={`clamp(1rem, 4.5vw, 1.5rem)`}>
                Habit
            </Typography>
        </Button>
    );
};

const CreateHabitDialogTitle = () => {
    return (
        <>
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                <Image
                    src={habitsImg}
                    width={120}
                    height={0}
                    alt="logo"
                    // sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' define something like this to improve future performance on images
                />
                <Typography fontWeight={600} fontSize="1em" pb={2}>
                    Create new Habit
                </Typography>
            </Box>
        </>
    );
};
