'use client';
import { UserT } from "@/lib/types-and-constants";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import grey from "@mui/material/colors/grey";
import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import DialogModal from "@/components/shared/DialogModal/dialog-modal";
import ButtonBase from "@mui/material/ButtonBase";
import UserAvatarSelector from "./user-avatar-selector";
import UserAvatar from "@/components/shared/UserAvatar/user-avatar";
import { FormikStep, FormikStepper } from "@/components/shared/FormikStepper/formik-stepper";
import ChangeUserAvatarFormikStepper from "./change-user-avatar-formik-stepper";

interface ChangeUserAvatarModalProps {
    user: UserT;
}

/**
 * 
 */
export default function ChangeUserAvatarModal({user} : ChangeUserAvatarModalProps) {

    return (
        <>
            <DialogModal
                button={<CLickableAvatar user={user} />}
                childrenTitle={
                    <Typography fontWeight={600} fontSize='1em' pb={2}>
                        Change your Avatar
                    </Typography>}
                childrenBody={
                    <ChangeUserAvatarFormikStepper user={user} />
                }
            />
        </>
    )
}

/**
 * The user avatar which can be clicked in order to change the current Avatar
 */
const CLickableAvatar = ({user, ...props} : ChangeUserAvatarModalProps)  => (
        <ButtonBase {...props} >
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                    <Avatar
                        alt="Edit"
                        sx={{ bgcolor: grey[500], width: 30, height: 30, outline: 'solid white' }}>
                        <EditIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                }
            >
                <UserAvatar user={user} circleDiameter={70} initialsFontSize="2.5rem" initialsFontWeight={700} />
            </Badge>
        </ButtonBase>
    );