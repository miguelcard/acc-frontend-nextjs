import DialogModal from '@/components/shared/DialogModal/dialog-modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddRoundedIcon  from '@mui/icons-material/AddRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import Image from 'next/image';
import createHabitImage from '@/public/images/spaces/create-habit-hand.svg';
import CreateHabitForm from './create-habit-form';
import IconButton from '@mui/material/IconButton';
import styles from './create-habit-modal.module.css';
import { InviteMembers } from '../MoreOptionsMenu/invite-members';

type Props = 
{ 
    spaceId: number;
    isFirstSpaceHabit: boolean;
};

/**
 * @param { spaceId :number }
 * The Modal for creating a Habit
 */
export default function CreateHabitAndInviteMembersModals(props: Props) {
    
    const {spaceId, isFirstSpaceHabit} = props;

    const AddHabitOrInviteMemberButton = ({noExistingHabitsText, existingHabitsText} : { noExistingHabitsText: string, existingHabitsText: string}) => (
        <Box maxWidth="lg" sx={{ display: 'inline-block' }} >
            <IconButton 
                className={`${styles['new_habit_button']} ${isFirstSpaceHabit ? styles['pulse_animation'] : ''}`}
            >
                <Typography fontWeight={600} fontSize={'0.6em'}
                    className={`${isFirstSpaceHabit ? '' : styles['new_habit_button_text']}`}
                >
                    {isFirstSpaceHabit ? noExistingHabitsText : existingHabitsText }
                </Typography>
                {isFirstSpaceHabit ?
                    <AddCircleRoundedIcon sx={{ marginLeft: 1, scale: { xs: 1, sm: 1.2, md: 1.3 } }} />
                    :
                    <AddRoundedIcon sx={{ scale: { xs: 1, sm: 1.2, md: 1.3 } }} />
                }
            </IconButton>
        </Box>
    );

    return (
        <Box
            sx={{
                position: 'fixed',
                right: 'clamp(6px, 3vw, 110px)',
                bottom: 'clamp(65px, 6vw, 70px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
            }}
        >
            {isFirstSpaceHabit && <DialogModal
                button={<AddHabitOrInviteMemberButton noExistingHabitsText={'Invite Members'} existingHabitsText={''} />}
                childrenTitle={'Invite Members'}
                childrenBody={<InviteMembers spaceId={spaceId} />}
            />}
            <DialogModal
                button={<AddHabitOrInviteMemberButton noExistingHabitsText={'Add your first habit'} existingHabitsText={'Habit'} />}
                childrenTitle={<CreateHabitDialogTitle />}
                childrenBody={<CreateHabitForm spaceId={spaceId} />}
            />
        </Box>
    );
}


export const CreateHabitDialogTitle = () => (
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Box sx={{ my: 2 }}>
            <Image src={createHabitImage} width={200} height={0} alt="habit" />
        </Box>
        <Typography fontWeight={600} fontSize="1em" pb={2}>
            Create new Habit
        </Typography>
    </Box>
);