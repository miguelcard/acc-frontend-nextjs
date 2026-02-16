import DialogModal from '@/components/shared/DialogModal/dialog-modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import Image from 'next/image';
import createHabitImage from '@/public/images/spaces/create-habit-hand.svg';
import CreateHabitForm from './create-habit-form';
import { Button } from '@mui/material';
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

    const buttonStyles = {
        backdropFilter: 'blur(7px)',
        WebkitBackdropFilter: 'blur(7px)',
        bgcolor: 'rgba(82, 73, 245, 0.75)',
        border: '1px solid rgba(101, 93, 255, 0.47)',
        borderRadius: '32px',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        color: '#ffffff',
        fontWeight: 600,
        padding: '4px 10px',
        transition: 'all 0.3s ease',
        textTransform: 'none',
        '&:hover': {
            bgcolor: 'rgba(101, 93, 255, 0.9)',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.15)',
        },
        ...(isFirstSpaceHabit && {
            animation: 'pulse 5s infinite',
            '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
                '100%': { transform: 'scale(1)' },
            },
        }),
    };

    const BottomActionButton = ({text, icon}: {text: string, icon: React.ReactNode}) => (
        <Button
            variant="contained"
            sx={buttonStyles}
            endIcon={icon}
        >
            {text}
        </Button>
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
                gap: 2,
                mb: 2
            }}
        >
            {isFirstSpaceHabit && <DialogModal
                button={<BottomActionButton text={'Invite Members'} icon={<AddCircleRoundedIcon />} />}
                childrenTitle={'Invite Members'}
                childrenBody={<InviteMembers spaceId={spaceId} />}
            />}
            <DialogModal
                button={<BottomActionButton text={'Add your first habit'} icon={<AddCircleRoundedIcon />} />}
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