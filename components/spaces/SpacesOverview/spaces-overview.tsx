'use client';
import { Box, Grid, Link, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { SpaceDetailed } from '@/lib/types-and-constants';
import { CustomCard } from './single-space-card';
import { SpaceDefaultDescription } from './space-users-information';
import { AvatarsGroup, MembersList } from '@/components/shared/SpaceMembers/space-members';
import { ClickableAvatarsGroup } from '@/components/shared/SpaceMembers/clickable-avatars-group';
import { useUserSpaces } from '@/lib/hooks/queries';
import introImage from '@/public/images/spaces/spaces-intro.png';
import NextLink from 'next/link';
import QueryError from '@/components/shared/QueryError/query-error';


/**
 * Overview of all the spaces where the user belongs
 */
export default function SpacesOverview() {
    const { data: spaces, isLoading, isError, refetch } = useUserSpaces();

    if (isLoading && !spaces) {
        return <Box py={6} display="flex" justifyContent="center"><CircularProgress color="secondary" size={60} /></Box>;
    }

    if (isError && !spaces) {
        return <QueryError onRetry={() => refetch()} />;
    }

    if (!spaces) {
        return <QueryError onRetry={() => refetch()} />;
    }

    return (
        <>
            {spaces.results.length === 0 ? (
                <NoExistingSpacesText />
            ) : (
                <Grid container rowSpacing={4} columnSpacing={{ xs: 2, sm: 2, md: 3, lg: 3 }} py={4} >
                    {spaces.results.map((space: SpaceDetailed) => (
                        <Grid  size={spaces.results.length == 1 ? 12 : { xs: 12, md: 6, lg: 6 }} key={space.id} >
                            <CustomCard
                                space={space}
                                defaultDescription={<SpaceDefaultDescription spaceId={space.id} />}
                                membersOverview={<MembersList spaceId={space.id} />}
                            >
                                <ClickableAvatarsGroup membersOverview={<MembersList spaceId={space.id} />}>
                                    <AvatarsGroup spaceId={space.id} />
                                </ClickableAvatarsGroup>
                            </CustomCard>
                        </Grid>
                    ))}
                </Grid>
                // TODO do arrows here, dont show if there is nothing else to show - KISS, maybe something like an already existing carrousel
                // so that its horizontally scrollbar
            )}
        </>
    );
}

const NoExistingSpacesText = () => {
    return (
        <Box
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
        >
            <Typography fontWeight="600" fontSize='1.1em' sx={{ pt: 3, pb: 1 }}>
                Welcome to Habit Habits 👋
            </Typography>

            <Typography textAlign='left' fontWeight="600" fontSize='0.9em' sx={{ py: 3 }}>
                On this page, you can create a new space 🌎, a dedicated area where you can track your habits and share them with others to progress together. 
                <br /><br />You can also get invited by someone to a space, by sharing your username with them.{" "}
                <Link href="/how-to-join-spaces" underline="always" color='secondary' component={NextLink}>
                    {'Learn how to join an existing space.'}
                </Link>
            </Typography>
            
            <img
                src={introImage.src ?? introImage}
                width={180}
                alt="into"
                style={{ height: 'auto' }}
            />

            <Typography textAlign='center' fontWeight="600" fontSize='0.9em' sx={{ py: 3 }}>
                If you want to create your first space click on the button below 👇
            </Typography>

        </Box>
    );
};
