'use client';

import { HabitT } from '@/lib/types-and-constants';
import { Avatar, Box, ButtonBase, Divider, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
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
import CreateHabitForm from '@/components/space/CreateHabitModal/create-habit-form';
import DialogModal from '@/components/shared/DialogModal/dialog-modal';
import { CreateHabitDialogTitle } from '@/components/space/CreateHabitModal/create-habit-modal';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import { SpaceIconLogic } from '@/components/shared/space-icon';


type UserAllHabitsViewPropsT = {
    userHabitsGroupedBySpace: SpaceHabitsGroup[];
    onDateRangeChange?: (dateRangeCode: string) => Promise<HabitT[]>;
};

export function AllUserHabitsView({
    userHabitsGroupedBySpace,
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

    return (
        <Box sx={{ width: '100%' }}>
            <DatesRangeSelector
                dates={dates}
                setDates={setDates}
                updateCheckedDates={handleDateRangeUpdate}
            />

            {userHabitsGroupedBySpace.map((spaceGroup) => {
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
                                            <Typography fontWeight={700} fontSize={`clamp(0.9rem, 2.5vw, 1.2rem)`} color='secondary'
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
                            {habits.length > 0 ? (
                                <SmallScreenHabitScoreCard
                                    ownerHabits={habits}
                                    checkedDates={checkedDates}
                                    dates={dates}
                                    setCheckedDates={setCheckedDates}
                                />
                            ) : (
                                <Box sx={{ padding: '10px', textAlign: 'center' }}>
                                    No habits in this space
                                </Box>
                            )}
                        </ContentCard>
                        
                        {/* Divider below the habits card */}
                        {collapsedSpaces.includes(space.id) && (
                            <Divider sx={{ my: 1, mx: 2 }} />
                        )}
                    </Box>
                );
            })}

            {userHabitsGroupedBySpace.length === 0 && (
                <ContentCard sx={{ textAlign: 'center', padding: 3 }}>
                    <Typography>You haven't created any habits yet</Typography>
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
    <DialogModal
        button={children}
        childrenTitle={<CreateHabitDialogTitle />}
        childrenBody={<CreateHabitForm spaceId={spaceId} />}
        onOpenChange={onModalStateChange}
    />
);