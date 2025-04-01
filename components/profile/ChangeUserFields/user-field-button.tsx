
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Typography } from "@mui/material";


interface UserFieldButtonProps {
    icon: React.ReactElement;
    text: string;
    isEnabled?: boolean;
    valueToShow?: string;
}

/**
 * Individual button from the user profile to edit his information
 */
export default function UserFieldButton({icon, text, isEnabled = true, valueToShow, ...rest} : UserFieldButtonProps) {
    return (
        <ListItem disablePadding {...rest} >
            <ListItemButton>
                <ListItemIcon sx={{minWidth:'40px'}}>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
                {isEnabled && <KeyboardArrowRightIcon />}
                {valueToShow && <Typography fontSize={"0.7em"}>{valueToShow}</Typography>}
            </ListItemButton>
        </ListItem>
    )
}