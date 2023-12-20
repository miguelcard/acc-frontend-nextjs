'use client';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

import grey from "@mui/material/colors/grey";
import DialogModal from "@/components/shared/DialogModal/dialog-modal";
import { Space } from "@/app/spaces/[id]/page";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { EditSpaceDescription } from "./edit-space-description";
import { InviteMembers } from "./invite-members";

interface MoreOptionsMenuProps {
    space: Space;
}

/**
 * TODO
 */
export function MoreOptionsMenu({ space }: MoreOptionsMenuProps) {

    const [anchorElOptions, setAnchorOptions] = useState<null | HTMLElement>(null);

    const handleOpenOptionsMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorOptions(event.currentTarget);
    };

    const handleCloseOptionsMenu = () => {
        setAnchorOptions(null);
    };


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
            name: "Space info",
            click: () => {
                handleCloseOptionsMenu();
            },
            icon: <InfoIcon sx={sxIconStyle} />,
            childrenBody: <EditSpaceDescription space={space}/>
        },
        {
            name: "Rename Space",
            click: () => { handleCloseOptionsMenu(); },
            icon: <EditIcon sx={sxIconStyle} />
        },
        {
            name: "Invite members",
            click: () => { handleCloseOptionsMenu(); },
            icon: <PersonAddIcon sx={sxIconStyle} />,
            childrenBody: <InviteMembers space={space}/>
        },
        {
            name: "Change Avatar",
            click: () => { handleCloseOptionsMenu(); },
            icon: <InsertEmoticonIcon sx={sxIconStyle} />
        },
    ];


    return (
        <>
            <Tooltip title="More options">
                <IconButton onClick={handleOpenOptionsMenu} aria-label="More options" sx={{ ml: 'auto' }} >
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
                    <DialogModal key={option.name}
                        button={
                            <MenuItem onClick={option.click}>
                                <ListItemIcon>
                                    {option.icon}
                                </ListItemIcon>
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