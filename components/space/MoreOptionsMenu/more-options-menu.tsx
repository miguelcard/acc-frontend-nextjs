'use client';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import LogoutIcon from '@mui/icons-material/Logout';
import { grey } from '@mui/material/colors';
import DialogModal from '@/components/shared/DialogModal/dialog-modal';
import { SpaceT } from '@/lib/types-and-constants';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { EditSpaceDescription } from './edit-space-description';
import { InviteMembers } from './invite-members';
import { EditSpaceTitle } from './edit-space-title';
import { ChangeAvatar } from './change-avatar';
import { LeaveSpace } from './leave-space';
import { CustomSnackbar } from '@/components/shared/Snackbar/snackbar';

interface MoreOptionsMenuProps {
    space: SpaceT;
}

/**
 * This is a 3 dots menu that when clicked opens a modal where the user can
 * choose between different options to edit the space, this options include:
 * Changing the space title and description, adding members, etc...
 */
export function MoreOptionsMenu({ space }: MoreOptionsMenuProps) {
    // Anchor element to open menu
    const [anchorElOptions, setAnchorOptions] = useState<null | HTMLElement>(null);

    const handleOpenOptionsMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorOptions(event.currentTarget);
    };

    const handleCloseOptionsMenu = () => {
        setAnchorOptions(null);
    };

    // Sets toast open when user added successfully
    const [openToast, setOpenToast] = useState<boolean>(false);

    const handleToastOpen = () => {
        setOpenToast(true);
    };
    
    const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        // if the user clicked somewhere outside the snackbar, do not close it.
        if (reason === 'clickaway') {
            return;
        }
        setOpenToast(false);
    };
    // end of specific toast functionalities

    type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void;

    interface MenuOption {
        name: string;
        click: ClickHandler;
        icon: React.ReactElement;
        childrenBody?: React.ReactElement;
    }

    const sxIconStyle = { fontSize: 18, color: grey[500] };

    const menuOptions: MenuOption[] = [
        {
            name: 'Space description',
            click: () => {
                handleCloseOptionsMenu();
            },
            icon: <InfoIcon sx={sxIconStyle} />,
            childrenBody: <EditSpaceDescription space={space} />,
        },
        {
            name: 'Rename space',
            click: () => {
                handleCloseOptionsMenu();
            },
            icon: <EditIcon sx={sxIconStyle} />,
            childrenBody: <EditSpaceTitle space={space} />,
        },
        {
            name: 'Invite members',
            click: () => {
                handleCloseOptionsMenu();
            },
            icon: <PersonAddIcon sx={sxIconStyle} />,
            childrenBody: <InviteMembers spaceId={space.id} handleToastOpen={handleToastOpen} />,
        },
        {
            name: 'Change avatar',
            click: () => {
                handleCloseOptionsMenu();
            },
            icon: <InsertEmoticonIcon sx={sxIconStyle} />,
            childrenBody: <ChangeAvatar space={space} />,
        },
        {
            name: 'Leave space',
            click: () => {
                handleCloseOptionsMenu();
            },
            icon: <LogoutIcon sx={sxIconStyle} />,
            childrenBody: <LeaveSpace space={space} />,
        },
    ];

    return (
        <>
            <CustomSnackbar
                isOpen={openToast}
                text={'Success! The user has been added to the Space. They can now view and contribute habits.'}
                handleCloseToast={handleToastClose}
            />
            {/* if you wanted to add other snackbars here you would add the other ones here with different states triggered by other modals */}
            <Tooltip title="More options">
                <IconButton onClick={handleOpenOptionsMenu} aria-label="More options" sx={{ ml: 'auto' }}>
                    <MoreVertIcon />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px', maxWidth: '100%' }}
                id="more-options-menu"
                anchorEl={anchorElOptions}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElOptions)}
                onClose={handleCloseOptionsMenu}
            >
                {menuOptions.map((option) => (
                    <DialogModal
                        key={option.name}
                        button={
                            <MenuItem onClick={option.click}>
                                <ListItemIcon>{option.icon}</ListItemIcon>
                                <ListItemText sx={{ color: grey[700], pr: 7, py: 1 }}>{option.name}</ListItemText>
                            </MenuItem>
                        }
                        childrenTitle={option.name}
                        childrenBody={option.childrenBody}
                    />
                ))}
            </Menu>
        </>
    );
}
