import 'server-only';
import { SpaceT, UserT } from '@/lib/types-and-constants';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { stringIconMapper } from '@/lib/fa-icons-mapper';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Avatar from '@mui/material/Avatar';
import React from 'react';
import { MoreOptionsMenu } from '@/components/space/MoreOptionsMenu/more-options-menu';
import Link from 'next/link';
import styles from './page.module.css';
import { IconButton } from '@mui/material';
import CreateHabitModal from '@/components/space/Habits/create-habit-modal';
import { ScoreCard } from '@/components/space/Habits/score-card';
import { getSpace, getUser } from '@/lib/actions';
import { redirect } from 'next/navigation';
import { setMaxStringLength } from '@/lib/client-utils';
import { grey } from '@mui/material/colors';

export default async function SingleSpace({ params }: { params: { id: number } }) {
    const { id } = params;
    const space: SpaceT = await getSpace(id);
    const { members, space_habits, name, description, icon_alias, error } = space;
    let user: UserT;

    const res = await getUser();

    // TODO this is checking right now if the user is authenticated based on an error. Improve proactively
    if (res.error) return redirect(`/login`);
    user = res;

    if (error) {
        // write an error message in the GUI manually or throw an error to be handled by next error boundry.
    }

    return (
        <Container component="section" maxWidth="lg">
            <CssBaseline />
            <Box display="flex" position="relative" justifyContent="center" alignItems="center" flexDirection="column">
                <Box className={styles.back_to_spaces_container}>
                    <Link href={'/home'}>
                        <IconButton className={styles.back_to_spaces_icon} aria-label="spaces">
                            <FontAwesomeIcon icon={faArrowLeft} size="sm" />
                        </IconButton>
                    </Link>
                </Box>
                <Box width={'100%'}>
                    <Box display="flex" alignItems="center" gap="28px" sx={{ px: 1, pt: 3 }}>
                        <Avatar
                            sx={{
                                width: 64,
                                height: 64,
                                bgcolor: grey[500],
                                '@media (max-width: 600px)': {
                                    width: 56,
                                    height: 56,
                                },
                            }}
                        >
                            <FontAwesomeIcon icon={stringIconMapper[`${icon_alias || 'rocket'}`]} size="xl" />
                        </Avatar>
                        {/* Space title */}
                        <Typography
                            fontWeight="700"
                            fontSize="1.3em"
                            color="secondary"
                            sx={{
                                '@media (max-width: 600px)': {
                                    fontSize: '1.1em',
                                },
                                '@media (max-width: 370px)': {
                                    fontSize: '1.1em',
                                },
                            }}
                        >
                            {setMaxStringLength(name, 120)}
                        </Typography>

                        <MoreOptionsMenu space={space} />
                    </Box>

                    {/* Habits and their score cards */}
                    {space_habits && space_habits.length > 0 && members && members.length > 0 ? (
                        <>
                            <ScoreCard currentUser={user} spaceHabits={space_habits} members={members} spaceId={id} />
                            {/* Create newHabits */}
                            <CreateHabitModal spaceId={id} isFirstSpaceHabit={false} />
                        </>
                    ) : (
                        <CreateHabitModal spaceId={id} isFirstSpaceHabit={true} />
                    )}

                </Box>
            </Box>
        </Container>
    );
}


const PlaceHolderCard = () => {
    return (
        <Card
            variant="outlined"
            sx={{
                my: 3,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: '#E8EAED',
            }}
        >
            <CardContent>
                <Typography fontWeight="500" sx={{ py: 3 }}>
                    {"hola text"}
                </Typography>
            </CardContent>
        </Card>
    );
};
