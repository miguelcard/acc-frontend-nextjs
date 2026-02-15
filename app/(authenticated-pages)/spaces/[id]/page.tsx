import 'server-only';
import { SpaceT, UserT } from '@/lib/types-and-constants';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Avatar from '@mui/material/Avatar';
import React from 'react';
import { MoreOptionsMenu } from '@/components/space/MoreOptionsMenu/more-options-menu';
import { Paper } from '@mui/material';
import CreateHabitAndInviteMembersModals from '@/components/space/CreateHabitModal/create-habit-modal';
import { ScoreCard } from '@/components/space/ScoreCard/score-card';
import { notFound, redirect } from 'next/navigation';
import { setMaxStringLength } from '@/lib/client-utils';
import { grey } from '@mui/material/colors';
import { getSpace, getUser } from '@/lib/fetch-functions';
import { BackButtonAutoRouted } from '@/components/shared/back-button-auto-routed';
import { SpaceIconLogic } from '@/components/shared/space-icon';

export default async function SingleSpace(props: { params: Promise<{ id: number }> }) {
    const params = await props.params;
    const { id } = params;
    const space: SpaceT = await getSpace(id);
    const { members, space_habits, name, description, icon_alias, error } = space;
    const spaceHasExistingHabits: boolean = Boolean(space_habits && space_habits.length > 0);
    const spaceHasExistingMembers: boolean = Boolean(members && members.length > 0)


    // If the user does not belong to the space or the space does not exist, both scenarios just return an 404 not found error
    if (error) {
        console.log('User entered requested a space where he does not belong / does not exist');
        // go to not found page
        notFound();
    }


    const res = await getUser();


    if (res.error) {
        console.log("TODO write error message in the GUI, the error can appear here because the user could not be retrieved BUT he was authenticated");
        console.log(" this is unlikely to happen becuse this can only happen if the backend is down or something like that");
        // delete auth_token from the user which might be no longer valid, to retrigger authentication
        redirect('/api/delete-cookie');
    }

    const user: UserT = res;

    return (
        <Container component="section" maxWidth="lg"
            // sx={{
            //     bgcolor: grey[100],
            // }}
        >
            <CssBaseline />
            <Box
                display="flex"
                position="relative"
                justifyContent="center"
                // alignItems="center"
                flexDirection="column"
                width="100%"
            >
                {/* Enclosing box for space header */}
                <Paper
                    // elevation={2}
                    variant="elevation"
                    square
                    sx={{
                        width: '100vw',
                        left: '50%',
                        right: '50%',
                        marginLeft: '-50vw',
                        marginRight: '-50vw',
                        position: 'relative',
                        px: 1,
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        bgcolor: 'rgba(255, 255, 255, 0.45)',
                        border: '1.5px solid rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between"
                        sx={{
                            px: 1, py: 1,
                            minWidth: 0,
                            width: '100%',
                        }}>

                        {/* Back button box */}
                        <BackButtonAutoRouted />
                        
                        {/* Space avatar and title box */}
                        <Box sx={{
                            margin: "auto",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            minWidth: 0,
                            mx: 1,
                        }}>
                            <Avatar
                                sx={{
                                    width: 44,
                                    height: 44,
                                    bgcolor: grey[500],
                                    '@media (max-width: 600px)': {
                                        width: 40,
                                        height: 40,
                                    },
                                    '@media (max-width: 450px)': {
                                        width: 32,
                                        height: 32,
                                    },
                                }}
                            >
                                {/* Box wrapper to control the sizes of the font awesome icon */}
                                <Box
                                    sx={{
                                        fontSize: '2rem', // Default size (xl)
                                        '@media (max-width: 600px)': {
                                            fontSize: '1.4rem',
                                        },
                                        '@media (max-width: 450px)': {
                                            fontSize: '1.1rem',
                                        },
                                        '@media (min-width: 601px)': {
                                            fontSize: '1.6rem',
                                        },
                                    }}
                                >
                                    <SpaceIconLogic iconAlias={icon_alias}  />
                                </Box>
                            </Avatar>
                            {/* Space title */}
                            <Typography
                                // component="span"
                                fontWeight="700"
                                fontSize="1em"
                                color="secondary"
                                sx={{
                                    whiteSpace: 'noWrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    '@media (max-width: 600px)': {
                                        fontSize: '1em',
                                    },
                                    '@media (max-width: 450px)': {
                                        fontSize: '0.9em',
                                    },
                                    '@media (max-width: 370px)': {
                                        fontSize: '0.85em',
                                    },
                                }}
                            >
                                {setMaxStringLength(name, 40)}
                            </Typography>
                        </Box>

                        {/* Box for the more options menu */}
                        <Box>
                            <MoreOptionsMenu space={space} />
                        </Box>
                    </Box>
                </Paper>

                {/* Habits and their score cards */}
                {spaceHasExistingMembers && <ScoreCard currentUser={user} spaceHabits={space_habits ?? []} members={members ?? []} spaceId={id} />}
                <CreateHabitAndInviteMembersModals spaceId={id} isFirstSpaceHabit={!spaceHasExistingHabits} />
            </Box>
        </Container>
    );
}
