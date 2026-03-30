'use client';
import { usePathname } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import { MoreOptionsMenu } from '@/components/space/MoreOptionsMenu/more-options-menu';
import { Paper } from '@mui/material';
import CreateHabitAndInviteMembersModals from '@/components/space/CreateHabitModal/create-habit-modal';
import { ScoreCard } from '@/components/space/ScoreCard/score-card';
import { setMaxStringLength } from '@/lib/client-utils';
import { grey } from '@mui/material/colors';
import { BackButtonAutoRouted } from '@/components/shared/back-button-auto-routed';
import { SpaceIconLogic } from '@/components/shared/space-icon';
import { useSpace } from '@/lib/hooks/queries';
import { useUser } from '@/lib/hooks/queries';
import { useAuth } from '@/lib/auth/auth-context';
import QueryError from '@/components/shared/QueryError/query-error';

/**
 * Extract the numeric space ID from the URL pathname.
 * Uses usePathname() which is reactive and always reflects the real browser
 * URL — unlike useParams() which may return the pre-rendered placeholder
 * slug ('_') in Capacitor static export.
 */
function useSpaceIdFromUrl(): number {
    const pathname = usePathname();
    // pathname = /spaces/{id}  or  /spaces/{id}/members
    const parts = pathname.split('/').filter(Boolean);
    if (parts[0] === 'spaces' && parts.length >= 2) {
        const id = Number(parts[1]);
        if (!isNaN(id) && id > 0) return id;
    }
    return NaN;
}

export default function SingleSpaceClient() {
    const id = useSpaceIdFromUrl();
    const { loading: authLoading } = useAuth();
    const { data: space, isLoading: spaceLoading, isError: spaceError } = useSpace(id);
    const { data: user, isLoading: userLoading, isError: userError } = useUser();

    // Include authLoading: on full page reloads (common in Capacitor),
    // Firebase auth re-initializes asynchronously. Until that completes,
    // queries are disabled and isLoading=false with data=undefined.
    // Without this check, the component would prematurely show "not found".
    const loading = authLoading || spaceLoading || userLoading;
    const hasError = spaceError || userError;
    const hasData = !!space && !!user;

    // Only show error screen when we have NO cached data to display
    if (hasError && !hasData) {
        return (
            <Container component="section" maxWidth="lg">
                <QueryError onRetry={() => window.location.reload()} />
            </Container>
        );
    }

    if (loading && !hasData) {
        return <Box py={6} display="flex" justifyContent="center"><CircularProgress color="secondary" size={60} /></Box>;
    }

    if (!space || !user) {
        return (
            <Container component="section" maxWidth="lg">
                <QueryError message="Space not found." onRetry={() => window.location.reload()} />
            </Container>
        );
    }

    const { members, space_habits, name, icon_alias } = space;
    const spaceHasExistingHabits: boolean = Boolean(space_habits && space_habits.length > 0);
    const spaceHasExistingMembers: boolean = Boolean(members && members.length > 0);

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
