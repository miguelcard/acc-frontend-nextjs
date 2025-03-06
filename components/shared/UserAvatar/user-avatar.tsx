'use client';
import { MemberT, UserT } from "@/lib/types-and-constants";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { getLetter, stringToColor } from "./avatar-utils";


// TODO pass avatar-utils.ts to this folder

interface UserAvatarProps {
    user: UserT | MemberT;
    circleDiameter?: number;
    initialsFontSize?: string;
    initialsFontWeight?: number;
    previewUrl?: string;
}

/**
 * Returns the Avatar circle component for the requested user, with his initials if he has no avatar url saved in the DB.
 * @param user user 
 */
export default function UserAvatar({ user, circleDiameter, initialsFontSize, initialsFontWeight, previewUrl }: UserAvatarProps) {

    const baseRobotAvatarUrl: string = "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=";

    return (
        <Avatar
            key={user.id}
            src={`${previewUrl ?? baseRobotAvatarUrl + user.avatar_seed}`} //edit this so that logic handles just a profile photo when passed (seed)
            sx={{
                bgcolor: user.avatar_seed ? 'inherit' : stringToColor(user.username + user.id + (user.name ?? '')),
                width: circleDiameter,
                height: circleDiameter,
            }}
        >
            {/* only shown if there is no profile picture (src) */}
            <Typography
                sx={{
                    fontSize: initialsFontSize,
                    fontWeight: initialsFontWeight,
                }}
            >
                {getLetter(user.name, user.username)}
            </Typography>
        </Avatar>
    )
}

