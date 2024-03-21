import 'server-only';
import { getAuthCookie, getErrorMessage, setMaxStringLength } from '@/lib/utils';
import { GENERIC_ERROR_MESSAGE, Space, UserT } from '@/lib/types-and-constants';
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
import '../../../styles/singleSpace.css';
import { IconButton } from '@mui/material';
import CreateHabitModel from '@/components/space/Habits/ScoreCardCalander/CreateHabitModal';
import { ScoreCard } from '@/components/space/Habits/ScoreCardCalander/ScoreCard';
import { getSpace, getUser } from '@/lib/actions';
import { redirect } from 'next/navigation';

export default async function SingleSpace({ params }: { params: { id: number } }) {
    const { id } = params;
    const space: Space = await getSpace(id);

    let user: UserT;
    const res = await getUser();

    if (res.error) return redirect(`/login`);
    user = res;

    if (space.error) {
        // write an error message in the GUI manually or throw an error to be handled by next error boundry.
    }

    return (
        <Container component="section" maxWidth="lg">
            <CssBaseline />
            <Box display="flex" position="relative" justifyContent="center" alignItems="center" flexDirection="column">
                <Box className="back-container">
                    <Link href={'/home'}>
                        <IconButton className="back-icon" aria-label="spaces">
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
                                '@media (max-width: 600px)': {
                                    width: 56,
                                    height: 56,
                                },
                            }}
                        >
                            <FontAwesomeIcon icon={stringIconMapper[`${space.icon_alias || 'rocket'}`]} size="xl" />
                        </Avatar>

                        <Typography
                            fontWeight="700"
                            fontSize="1.3em"
                            color="secondary"
                            sx={{
                                '@media (max-width: 600px)': {
                                    fontSize: '1.1em',
                                },
                                '@media (max-width: 370px)': {
                                    fontSize: '1em',
                                },
                            }}
                        >
                            {setMaxStringLength(space.name, 120)}
                        </Typography>

                        <MoreOptionsMenu space={space} />
                    </Box>
                    <PlaceHolderCard text={'Stats...'} />
                    {/* Habits and there score cards */}
                    {space.space_habits.length > 0 ? (
                        <ScoreCard habits={space.space_habits} spaceId={space.id} user={user} members={space.members} />
                    ) : (
                        <PlaceHolderCard text={'No Habits Yet'} />
                    )}
                    {/* Create newHabits */}
                    <Container
                        sx={{
                            padding: '3px',
                            display: 'grid',
                            gap: '10px',
                            justifyContent: 'center',
                            gridTemplateColumns: '1fr',

                            width: '100%',
                            marginBottom: '10rem',
                        }}
                    >
                        {/* <Box
                            sx={{
                                padding: '3px',
                                justifyContent: 'center',
                            }}
                        > */}
                        <CreateHabitModel spaceId={space.id} />
                        <Box
                            sx={{
                                border: 'solid gray 0.5px',
                                padding: { xs: '10px', sm: '20px' },
                                borderRadius: '10px',
                            }}
                        >
                            username: {user.username} <br />
                            This is the Space with ID: {space.id} <br />
                            space desc: {space.description} <br />B
                        </Box>
                        {/* </Box> */}
                    </Container>
                </Box>
            </Box>
        </Container>
    );
}

//  TODO DELETE
const PlaceHolderCard = ({ text }: any) => {
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
                    {text}
                </Typography>
            </CardContent>
        </Card>
    );
};
