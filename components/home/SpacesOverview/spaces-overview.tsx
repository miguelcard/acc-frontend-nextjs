import 'server-only';
import { getAuthCookie, getErrorMessage } from '@/lib/utils';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import { GENERIC_ERROR_MESSAGE, PaginatedResponse, SpaceT } from '@/lib/types-and-constants';
import { CustomCard } from './single-space-card';
import { AvatarsGroup, SpaceDefaultDescription } from './space-users-information';
import { setMaxStringLength } from '@/lib/client-utils';

interface CreatorUser {
    id: number;
    username: string;
    name: string | null;
    last_name: string | null;
    profile_photo: string | null;
    // email: string;
    // about?: string | null;
    // is_active?: boolean;
}

interface SpaceDetailed extends SpaceT {
    creator: CreatorUser;
}

/**
 * Gets all the spaces that belong to the user
 * @returns list of spaces
 */
async function getUserSpaces() {
    const url = `${process.env.NEXT_PUBLIC_API}/v1/spaces/?page=1&page_size=4&ordering=-updated_at`; // For the future load automatically on scrolling
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `${getAuthCookie()}`,
        },
        cache: 'no-store', // just in case, but it isn't necessary if we use cookies above
    };

    try {
        const res = await fetch(url, requestOptions);
        const spaces = await res.json();
        if (!res.ok) {
            console.warn("Fetching user spaces didn't work");
            console.warn(getErrorMessage(spaces));
            return { error: GENERIC_ERROR_MESSAGE };
        }
        return spaces;
    } catch (error) {
        console.warn('An error ocurred: ', getErrorMessage(error));
        return { error: GENERIC_ERROR_MESSAGE };
    }
}

/**
 * Overview of all the spaces where the user belongs
 * Because SpacesOverview is a component using the async keyword, this gives a warning in the console for now:
 * "Failed prop type: Invalid prop `children` supplied to `ForwardRef(Box)`, expected a ReactNode."
 * hopefully is fixed in future MUI versions
 */
export default async function SpacesOverview() {
    const spaces: PaginatedResponse<SpaceDetailed> = await getUserSpaces();
    const maxDescLength: number = 66;

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
                                spaceId={space.id}
                                icon={space.icon_alias || 'rocket'}
                                title={space.name}
                                subtitle={space.creator != undefined ? 'Created by ' + space.creator.username : ''}
                                description={
                                    space.description ? (
                                        setMaxStringLength(space.description, maxDescLength)
                                    ) : (
                                        <span>
                                            <SpaceDefaultDescription spaceId={space.id} />
                                        </span>
                                    )
                                }
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
