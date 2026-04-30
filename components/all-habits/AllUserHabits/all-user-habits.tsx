'use client';

import { HabitT } from '@/lib/types-and-constants';
import { Avatar, Box, Button, ButtonBase, Chip, Divider, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import React, { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';
import DatesRangeSelector from '@/components/space/ScoreCard/dates-range-selector';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ContentCard from '@/components/shared/ContentCard/content-card';
import { SmallScreenHabitScoreCard } from '@/components/space/ScoreCard/score-card-sizes/small-screen-habit-score-card';
import { useHabitScorecard } from '@/lib/hooks/useHabitScorecard';
import { SpaceHabitsGroup } from '@/lib/utils/group-habits-by-space';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { setMaxStringLength } from '@/lib/client-utils';
import { grey } from '@mui/material/colors';
import { useRouter } from 'next/navigation';
import { CreateHabitDialogModal } from '@/components/space/CreateHabitModal/create-habit-modal';
import DialogModal from '@/components/shared/DialogModal/dialog-modal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import { SpaceIconLogic } from '@/components/shared/space-icon';
import CreateSpaceForm from '@/components/spaces/CreateSpaceModal/create-space-form';
import { CreateSpaceDialogTitle } from '@/components/spaces/CreateSpaceModal/create-space-modal';


type UserAllHabitsViewPropsT = {
    userHabitsGroupedBySpace: SpaceHabitsGroup[];
    hasSpaces: boolean;
    onDateRangeChange?: (dateRangeCode: string) => Promise<HabitT[]>;
};

export function AllUserHabitsView({
    userHabitsGroupedBySpace,
    hasSpaces,
    onDateRangeChange
}: UserAllHabitsViewPropsT) {

    const router = useRouter();

    // Flatten all habits from all spaces for initial state
    const allUserHabits = useMemo(() =>
        userHabitsGroupedBySpace.flatMap(space => space.habits),
        [userHabitsGroupedBySpace]
    );

    // Use shared hook for scorecard logic
    const { dates, setDates, checkedDates, setCheckedDates, updateCheckedDates } =
        useHabitScorecard(allUserHabits);

    // ============================= Collapse state (specific to this view)
    const [collapsedSpaces, setCollapsedSpaces] = useState<number[]>([]);

    const handleCollapseSpaceCard = (spaceId: number) => {
        if (collapsedSpaces.includes(spaceId)) {
            setCollapsedSpaces((prev) => prev.filter((id) => id !== spaceId));
        } else {
            setCollapsedSpaces([...collapsedSpaces, spaceId]);
        }
    };

    // Wrapper to handle date range updates
    const handleDateRangeUpdate = async (dateRangeCode: string) => {
        if (onDateRangeChange) {
            await updateCheckedDates(dateRangeCode, onDateRangeChange);
        }
    };

    const spacesWithHabits = userHabitsGroupedBySpace.filter(g => g.habits.length > 0);
    const spacesWithoutHabits = userHabitsGroupedBySpace.filter(g => g.habits.length === 0);

    return (
        <Box sx={{ width: '100%' }}>
            <DatesRangeSelector
                dates={dates}
                setDates={setDates}
                updateCheckedDates={handleDateRangeUpdate}
            />

            {spacesWithHabits.map((spaceGroup) => {
                const { space, habits } = spaceGroup;

                return (
                    <Box key={space.id} sx={{ mb: 2 }}>
                        {/* =============================== Space name header */}
                        <Box
                            component={'div'}
                            sx={{
                                display: 'flex',
                                gap: '5px',
                                alignItems: 'center',
                                height: '100%',
                                marginBottom: 0.5,
                                marginX: 1,
                                color: 'black',
                            }}
                        >
                            <Box pb={0.5} gap={1.5} display='flex' flexDirection='row'>
                                {/* ==== Space Avatar surrounded by colorful gradient ring =====*/}
                                <DialogModal
                                    button={
                                        <ColorfulSpaceAvatar spaceIcon={space.icon_alias || ''} />
                                    }
                                    childrenTitle={<SpaceModalTitle iconAlias={space.icon_alias} spaceName={space.name} />}
                                    childrenBody={
                                        <SpaceModalOptions spaceId={space.id} />
                                    }
                                />
                                {/* =================== Space title (is in button attribute) With Modal to  create a new habit in that space and to go to space ===========  */}
                                <Box alignSelf='center'>
                                    <DialogModal
                                        button={
                                            <Typography fontWeight={800} fontSize={`clamp(0.9rem, 2.5vw, 1.2rem)`} color='secondary'
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                {setMaxStringLength(space.name)}
                                            </Typography>
                                        }
                                        childrenTitle={<SpaceModalTitle iconAlias={space.icon_alias} spaceName={space.name} />}
                                        childrenBody={
                                            <SpaceModalOptions spaceId={space.id} />
                                        }
                                    />
                                </Box>
                            </Box>
                            {/* ======================== Collapse button ======================  */}
                            <ButtonBase
                                onClick={() => handleCollapseSpaceCard(space.id)}
                                sx={{ borderRadius: '5px', padding: '3px', marginRight: '5px', ml: 'auto' }}
                            >
                                <ChevronLeftIcon
                                    color='secondary'
                                    sx={{
                                        rotate: collapsedSpaces.includes(space.id) ? '-90deg' : '90deg',
                                        transition: 'all 0.2s ease-in-out',
                                        scale: '1.1',
                                    }}
                                />
                            </ButtonBase>
                        </Box>

                        {/* ============== Habits and checkmarks =========== */}
                        <ContentCard
                            hidden={collapsedSpaces.includes(space.id)}
                            sx={{ mb: 3 }}
                        >
                            <SmallScreenHabitScoreCard
                                ownerHabits={habits}
                                checkedDates={checkedDates}
                                dates={dates}
                                setCheckedDates={setCheckedDates}
                                spaceId={space.id}
                            />
                        </ContentCard>

                        {/* Divider below the habits card */}
                        {collapsedSpaces.includes(space.id) && (
                            <Divider sx={{ my: 1, mx: 2 }} />
                        )}
                    </Box>
                );
            })}

            {/* ============== Chip strip for spaces with no own habits =========== */}
            {spacesWithoutHabits.length > 0 && (
                <Box sx={{ mt: spacesWithHabits.length > 0 ? 1 : 0, mb: 2, px: 1, py: 1 }}>
                    <Typography variant='body2' color='text.secondary' fontWeight={700} letterSpacing={0.2} sx={{ mb: 1.5, fontSize: '0.95rem' }}>
                        Add your own habits in more spaces:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                        {spacesWithoutHabits.map(({ space }) => (
                            <WrapInCreateHabitModal key={space.id} spaceId={space.id}>
                                <Chip
                                    icon={
                                        <span style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', fontSize: '1.1rem' }}>
                                            <SpaceIconLogic iconAlias={space.icon_alias} />
                                        </span>
                                    }
                                    label={setMaxStringLength(space.name, 20)}
                                    clickable
                                    color='secondary'
                                    variant='outlined'
                                    sx={{
                                        borderRadius: '20px',
                                        fontSize: '0.92rem',
                                        height: '40px',
                                        borderWidth: '2px',
                                    }}
                                />
                            </WrapInCreateHabitModal>
                        ))}
                    </Box>
                </Box>
            )}

            {userHabitsGroupedBySpace.length === 0 && (
                <ContentCard sx={{ textAlign: 'center', padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {!hasSpaces ? (
                        <>
                            <Typography fontWeight={600}>You don&apos;t have any spaces yet</Typography>
                            <Typography variant='body2' color='text.secondary'>Create a space first, then start adding habits to it.</Typography>
                            <DialogModal
                                button={
                                    <Button variant='contained' color='secondary' size='small' sx={{ borderRadius: '20px', textTransform: 'none' }}>
                                        Create a Space
                                    </Button>
                                }
                                childrenTitle={<CreateSpaceDialogTitle />}
                                childrenBody={<CreateSpaceForm />}
                                keyboardLift={0.7}
                            />
                        </>
                    ) : (
                        // NOTE: This branch is unreachable — includeEmptySpaces:true guarantees
                        // all spaces appear, so length > 0 whenever hasSpaces is true.
                        // Kept as a safety net only.
                        <Typography color='text.secondary'>You haven&apos;t created any habits yet</Typography>
                    )}
                </ContentCard>
            )}
        </Box>
    );
}

const ColorfulSpaceAvatar = ({ spaceIcon, onClick }: { spaceIcon: string, onClick?: React.MouseEventHandler<HTMLDivElement> }) => (
    <Box
        onClick={onClick}
        sx={{
            cursor: 'pointer',
            width: 39,
            height: 39,
            p: '0px',
            borderRadius: '0.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            // background: "conic-gradient(from 0deg, #9A00FF, #4A00FF, #00E5FF, #00FFC8, #5E00FF, #B400FF, #FF00E5, #9A00FF)",
        }}
    >
        <Avatar
            variant="rounded"
            sx={{
                width: '100%',
                height: '100%',
                borderRadius: '0.75rem',
            }}
        >
            <SpaceIconAvatar iconAlias={spaceIcon} size={"lg"} />
        </Avatar>
    </Box>
);

const SpaceModalTitle = ({iconAlias, spaceName} : {iconAlias : string | undefined, spaceName: string  }) => (
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Box sx={{ my: 2 }}>
            <SpaceIconAvatar iconAlias={iconAlias} size="3x" />
        </Box>
        <Typography fontWeight={600} fontSize="1em" pb={2} color='secondary' >
            {spaceName}
        </Typography>
    </Box>
);

const SpaceIconAvatar = ({ iconAlias, size }: { iconAlias: string | undefined, size?: SizeProp }) => (
    <Avatar
        variant='circular'
        sx={{
            width: 100,
            height: 100,
            bgcolor: grey[500],
            '@media (max-width: 600px)': {
                width: 100,
                height: 100,
            },
            '@media (max-width: 450px)': {
                width: 100,
                height: 100,
            },
        }}
    >
        <SpaceIconLogic iconAlias={iconAlias} size={size} />
    </Avatar>
);

const SpaceModalOptions = ({ spaceId, handleCloseDialog}: { spaceId: number, handleCloseDialog?: () => void }) => {
    const router = useRouter()
    const [isChildModalOpen, setisChildModalOpen] = useState(true);

    // if this child modal is closed then handleCloseDialog...
    useEffect(() => {
        if (isChildModalOpen === false) {
            handleCloseDialog && handleCloseDialog();
        }
    }, [isChildModalOpen, handleCloseDialog]);

    return (
        <List>
            <ListItem disablePadding>
                <ListItemButton onClick={() => router.push(`/spaces/${spaceId}`)} >
                    <ListItemText primary={'Go to Space'} sx={{color: 'dimgrey'}} />
                    <ArrowForwardIcon fontSize='small' sx={{color: 'grey'}} />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <WrapInCreateHabitModal spaceId={spaceId} onModalStateChange={setisChildModalOpen} >
                    <ListItemButton>
                        <ListItemText primary={'Add new Habit'} sx={{ color: 'dimgrey' }} />
                        <AddIcon fontSize='small' sx={{ color: 'grey' }} />
                    </ListItemButton>
                </WrapInCreateHabitModal>
            </ListItem>
        </List>
    )
}

const WrapInCreateHabitModal = ({ children, spaceId, onModalStateChange }: { children: ReactElement, spaceId: number, onModalStateChange?: (isOpen: boolean) => void }) => (
    <CreateHabitDialogModal
        button={children}
        spaceId={spaceId}
        onOpenChange={onModalStateChange}
    />
);