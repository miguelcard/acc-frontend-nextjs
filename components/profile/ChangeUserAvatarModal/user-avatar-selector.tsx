'use client';
import UserAvatar from "@/components/shared/UserAvatar/user-avatar";
import { UserT } from "@/lib/types-and-constants";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormikContext } from "formik";
import { useDeferredValue, useEffect, useState } from "react";

interface UserAvatarSelectorProps {
    user: UserT;
}

/**
 * A selector where you can save the user avatar that the user is selecting as a seed and this is then used to 
 * generate a random user avatar based on that seed. As default options a clickable Grid is shown so that the user can choose a seed
 * from these options.
 * @param user 
 * @returns 
 */
export default function UserAvatarSelector({ user }: UserAvatarSelectorProps) {

    const [seed, setSeed] = useState<string>(user.avatar_seed ?? '');
    const defferedSeed: string = useDeferredValue(seed);
    const formikCtx = useFormikContext();
    
    useEffect(() => {
        // This effect will run only when deferredValue updates (i.e. after seed stops changing quickly)
        formikCtx.setFieldValue('avatar_seed', seed);
    }, [defferedSeed]);

    
    return (
        <>
            <Box display="flex" flexDirection="column" alignItems="center">
                <Typography fontSize={'0.75rem'} pb={2} textAlign='center' >
                    Type anything to generate a unique avatar or choose one from the options below!
                </Typography>
                <Box display='flex' flexDirection='row' alignItems='center' gap={3} >
                    <UserAvatar user={user} circleDiameter={70} initialsFontSize="3rem" initialsFontWeight={600} seed={defferedSeed} />
                    <TextField id="outlined-search" label="Seed" type="search" variant="standard" autoComplete="off" value={seed} onChange={(e) => setSeed(e.target.value)} inputProps={{ maxLength: 13 }} />
                </Box>
                {/* Grid showing possible avatars, the click changes the value of the seed */}
                <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 8, sm: 10, md: 16 }} sx={{pt: 3}}>
                    {seedsExamplesList.map((word, i) => (
                        <Grid size={{ xs: 2, sm: 2, md: 2 }} key={i} >
                            <Box onClick={() => setSeed(word)}>
                                <UserAvatar
                                    user={user}
                                    circleDiameter={50}
                                    seed={word}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>

            </Box>

        </>
    );
}


const seedsExamplesList: string[] = [
    "ZapCats",
    "FizzFox",
    "Walle",
    "Rooster",
    "RumbleBot",
    "Quirk",
    "Zonk",
    "Pounce",
    "Zippy",
    "Noodle",
    "rit",
    "Megatron",
    "Munchkin",
    "R2S",
    "SizzleWolf",
    "BuzzH",
];