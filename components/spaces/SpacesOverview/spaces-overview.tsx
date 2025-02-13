import 'server-only';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import { PaginatedResponse, SpaceDetailed } from '@/lib/types-and-constants';
import { CustomCard } from './single-space-card';
import { AvatarsGroup, SpaceDefaultDescription } from './space-users-information';
import { getUserSpaces } from '@/lib/fetch-functions';


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
                    You currently have no spaces, create one to get started.
                </Typography>
            </CardContent>
        </Card>
    );
};
