import { Box, ButtonBase, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import styles from '../habits.module.css';
import { useState } from 'react';
import DialogModal from '@/components/shared/DialogModal/dialog-modal';
import { grey } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import { HabitT } from '@/lib/types-and-constants';
import { EditHabit } from './edit-habit';
import { EditHabitTitle } from './edit-habit-title';
import InfoIcon from '@mui/icons-material/Info';
import { deleteHabit } from '@/lib/actions';
import toast from 'react-hot-toast';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export const HabitOptionsMenu = ({ habit }: { habit: HabitT }) => {
    const [anchorElOptions, setAnchorOptions] = useState<null | HTMLElement>(null);

    const handleOpenOptionsMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorOptions(event.currentTarget);

    const handleCloseOptionsMenu = () => {
        setAnchorOptions(null);
    };

    const handleDelete = async () => {
        handleCloseOptionsMenu();

        const res = await deleteHabit(habit);

        if (res.error) toast.error('Failed please try again.', { duration: 1000 });
        else
            toast.success('Deleted successfully', {
                duration: 1000,
            });
    };

    interface MenuOption {
        name: string;
        click: () => void;
        icon: React.ReactElement;
        childrenBody?: React.ReactElement;
    }

    const sxIconStyle = { fontSize: 18, color: grey[500] };

    const menuOptions: MenuOption[] = [
        {
            name: 'Rename Habit',

            click: () => {
                handleCloseOptionsMenu();
            },
            icon: <EditIcon sx={sxIconStyle} />,
            childrenBody: <EditHabitTitle habit={habit} />,
        },
        {
            name: 'Edit Habit',
            click: () => {
                handleCloseOptionsMenu();
            },
            icon: <InfoIcon sx={sxIconStyle} />,
            childrenBody: <EditHabit habit={habit} />,
        },
        {
            name: 'Delete Habit',
            click: () => {
                handleDelete();
            },
            icon: <DeleteForeverIcon sx={sxIconStyle} />,
        },
    ];
    return (
        <>
            <Tooltip title="Edit Habit" placement="right">
                <ButtonBase className={styles['habit_edit_button']} onClick={handleOpenOptionsMenu}>
                    <EditIcon fontSize="medium" />
                </ButtonBase>
            </Tooltip>
            <Menu
                sx={{ mt: '45px', maxWidth: '100%' }}
                id="edit-habit"
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
                {menuOptions.map((option) => {
                    return option.childrenBody ? (
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
                    ) : (
                        <Box key={option.name}>
                            <MenuItem onClick={option.click}>
                                <ListItemIcon>{option.icon}</ListItemIcon>
                                <ListItemText sx={{ color: grey[700], pr: 7, py: 1 }}>{option.name}</ListItemText>
                            </MenuItem>
                        </Box>
                    );
                })}
            </Menu>
        </>
    );
};
