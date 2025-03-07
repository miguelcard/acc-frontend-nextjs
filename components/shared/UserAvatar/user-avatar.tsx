'use client';
import { MemberT, UserT } from "@/lib/types-and-constants";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { getLetter, stringToColor } from "./avatar-utils";


interface UserAvatarProps {
    user: UserT | MemberT;
    circleDiameter?: number;
    initialsFontSize?: string;
    initialsFontWeight?: number;
    seed?: string;
}

/**
 * Returns the Avatar circle component for the requested user, with his initials if he has no avatar url saved in the DB.
 * @param user user 
 */
export default function UserAvatar({ user, circleDiameter, initialsFontSize, initialsFontWeight, seed }: UserAvatarProps) {

    const baseRobotAvatarUrl: string = "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=";
    const avatarUrl : string | undefined = user.avatar_seed ? baseRobotAvatarUrl + user.avatar_seed : undefined;
    // by default shows the letters and a backround color for the user
    let src: string | undefined = undefined;
    const defaultColor: string = stringToColor(user.username + user.id + (user.name ?? ''));
    let bgColor: string = defaultColor;

    if (seed == undefined) {
        src = avatarUrl; // undefined avatarUrl defaults to showing user initials
        bgColor = avatarUrl ? 'inherit' : defaultColor;
    } else if (seed !== "" ) { // seed has a non empty value
        // show preview url with seed value
        src = baseRobotAvatarUrl + seed;
        bgColor = 'inherit';
    }

    return (
        <Avatar
            key={user.id}
            src={src}
            sx={{
                bgcolor: bgColor,
                width: circleDiameter,
                height: circleDiameter,
            }}
        >
            {/* only shown if there is no profile picture (src is undefined) */}
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

