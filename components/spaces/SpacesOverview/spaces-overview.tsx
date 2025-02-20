import 'server-only';
import { Box, Grid, Typography } from '@mui/material';
import { PaginatedResponse, SpaceDetailed } from '@/lib/types-and-constants';
import { CustomCard } from './single-space-card';
import { AvatarsGroup, SpaceDefaultDescription } from './space-users-information';
import { getUserSpaces } from '@/lib/fetch-functions';
import introImage from '@/public/images/spaces/spaces-intro.png';
import Image from 'next/image';


/**
 * Overview of all the spaces where the user belongs
 * Because SpacesOverview is a component using the async keyword, this gives a warning in the console for now:
 * "Failed prop type: Invalid prop `children` supplied to `ForwardRef(Box)`, expected a ReactNode."
 * hopefully is fixed in future MUI versions
 */
export default async function SpacesOverview() {
    const spaces: PaginatedResponse<SpaceDetailed> = await getUserSpaces();

    if (spaces?.error) {
        // TODO how do I display this error messages in the gui without having to create a client component?
        // use sub-(client)-component ?
        // or just throw error to be handled by next js
        console.warn('retrieving user spaces has an error :', spaces.error);
        return;
    }

    return (
        <>
            {spaces.results.length === 0 ? (
                <NoExistingSpacesText />
            ) : (
                <Grid container spacing={4} py={4}>
                    {spaces.results.map((space) => (
                        <Grid item xs={12} md={6} lg={4} key={space.id}>
                            <CustomCard
                                space={space}
                                defaultDescription={<SpaceDefaultDescription spaceId={space.id} />}
                            >
                                <Box>
                                    <AvatarsGroup spaceId={space.id} />
                                </Box>
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
                <br /><br />You can also get invited by someone to a space, by sharing your username with them.
            </Typography>

            <Image
                src={introImage}
                width={180}
                height={0}
                alt="into"
            />

            <Typography textAlign='center' fontWeight="600" fontSize='0.9em' sx={{ py: 3 }}>
                Click the button below to create your first space 👇
            </Typography>

        </Box>
    );
};
