'use client';
import { Box, ButtonBase, Collapse, Typography } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { keyframes } from '@emotion/react';
import { CheckedDatesT, HabitT, MemberT } from '@/lib/types-and-constants';
import { computeMemberScore } from '@/lib/utils/compute-habit-progress';
import UserAvatar from '@/components/shared/UserAvatar/user-avatar';
import ContentCard from '@/components/shared/ContentCard/content-card';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MemberProfileModal } from '@/components/shared/SpaceMembers/member-profile-modal';

type MemberLeaderboardProps = {
    members: MemberT[];
    spaceHabits: HabitT[];
    checkedDates: CheckedDatesT;
    currentUserId: number;
};

const pop = keyframes`
  0%   { transform: rotate(-90deg) scale(1); }
  25%  { transform: rotate(-90deg) scale(1.6); }
  60%  { transform: rotate(-90deg) scale(0.85); }
  80%  { transform: rotate(-90deg) scale(1.1); }
  100% { transform: rotate(-90deg) scale(1); }
`;

const glow = keyframes`
  0%   { filter: drop-shadow(0 0 0px #FFD700); }
  40%  { filter: drop-shadow(0 0 12px #FFD700); }
  100% { filter: drop-shadow(0 0 3px #FFD700); }
`;

// Ball bounce: drops down, squashes on impact, bounces with decreasing height
const bounce = keyframes`
  0%   { transform: rotate(-90deg) translateY(0)    scale(1); }
  18%  { transform: rotate(-90deg) translateY(9px)  scaleX(1.35) scaleY(0.65); }
  36%  { transform: rotate(-90deg) translateY(-7px) scale(1); }
  50%  { transform: rotate(-90deg) translateY(5px)  scaleX(1.2) scaleY(0.8); }
  64%  { transform: rotate(-90deg) translateY(-3px) scale(1); }
  78%  { transform: rotate(-90deg) translateY(2px)  scale(1); }
  100% { transform: rotate(-90deg) translateY(0)    scale(1); }
`;

const SIZE = 28;
const STROKE = 3;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CompletionRing({ score }: { score: number }) {
    const isComplete = score >= 1;
    const pct = Math.min(score, 1);
    const offset = CIRCUMFERENCE * (1 - pct);
    const ringColor = isComplete ? '#FFD700' : `rgba(45, 195, 140, ${0.3 + pct * 0.7})`;

    // Trigger animation only once when newly complete
    const [animVariant, setAnimVariant] = useState<'pop' | 'bounce' | null>(null);
    const prevScore = useRef(score);
    useEffect(() => {
        if (score >= 1 && prevScore.current < 1) {
            setAnimVariant(Math.random() < 0.5 ? 'pop' : 'bounce');
            setTimeout(() => setAnimVariant(null), 1100);
        }
        prevScore.current = score;
    }, [score]);

    const animationStyle = animVariant === 'pop'
        ? { animation: `${pop} 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97), ${glow} 0.8s ease-out` }
        : animVariant === 'bounce'
        ? { animation: `${bounce} 1s cubic-bezier(0.33, 1, 0.68, 1), ${glow} 1s ease-out` }
        : {};

    return (
        <Box
            component='svg'
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            sx={{
                flexShrink: 0,
                transform: 'rotate(-90deg)',
                ...animationStyle,
                ...(isComplete && !animVariant && {
                    filter: 'drop-shadow(0 0 3px #FFD700)',
                }),
            }}
        >
            {/* Track */}
            <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill='none'
                stroke='rgba(150,150,150,0.2)'
                strokeWidth={STROKE}
            />
            {/* Progress arc */}
            <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill='none'
                stroke={ringColor}
                strokeWidth={STROKE}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
                strokeLinecap='round'
                style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.4s ease' }}
            />
        </Box>
    );
}

export function MemberLeaderboard({ members, spaceHabits, checkedDates, currentUserId }: MemberLeaderboardProps) {
    const [expanded, setExpanded] = useState(true);
    const [selectedMember, setSelectedMember] = useState<MemberT | null>(null);

    const memberScores = members
        .map((member) => {
            const habits = spaceHabits.filter((h) => h.owner === member.id);
            const score = computeMemberScore(habits, checkedDates);
            return { member, score };
        })
        .sort((a, b) => b.score - a.score);

    return (
        <ContentCard sx={{ mb: 2 }}>
            {/* ====== Header row with toggle ====== */}
            <ButtonBase
                onClick={() => setExpanded((prev) => !prev)}
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.5,
                    py: 1,
                    borderRadius: '8px',
                }}
            >
                <Typography fontWeight={600} fontSize='0.95em' sx={{ flex: 1, textAlign: 'center' }}>
                    Weekly Scorecard
                </Typography>
                <ExpandMoreIcon
                    sx={{
                        transition: 'transform 0.2s ease-in-out',
                        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        fontSize: '1.2rem',
                    }}
                />
            </ButtonBase>

            <Collapse in={expanded}>
                <Box sx={{ px: 1.5, pb: 1.5, display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    {memberScores.map(({ member, score }) => {
                        const isCurrentUser = member.id === currentUserId;

                        return (
                            <ButtonBase
                                key={member.id}
                                onClick={() => setSelectedMember(member)}
                                sx={{ display: 'flex', alignItems: 'center', gap: 1.2, width: '100%', borderRadius: 1 }}
                            >
                                {/* Avatar */}
                                <UserAvatar user={member} circleDiameter={26} initialsFontSize='0.8rem' initialsFontWeight={500} />

                                {/* Username */}
                                <Typography
                                    fontSize='0.82em'
                                    fontWeight={isCurrentUser ? 700 : 400}
                                    color={isCurrentUser ? 'secondary.main' : 'text.primary'}
                                    noWrap
                                    sx={{ flex: 1, minWidth: 0 }}
                                >
                                    {member.username}{isCurrentUser ? ' (you)' : ''}
                                </Typography>

                                {/* Completion ring */}
                                <CompletionRing score={score} />
                            </ButtonBase>
                        );
                    })}
                </Box>
            </Collapse>

            <MemberProfileModal
                member={selectedMember}
                open={!!selectedMember}
                onClose={() => setSelectedMember(null)}
            />
        </ContentCard>
    );
}
