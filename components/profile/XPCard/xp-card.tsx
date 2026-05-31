'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { alpha } from '@mui/material/styles';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useXPStats } from '@/lib/hooks/queries';

// ─── Level label mapping ──────────────────────────────────────────────────────
const LEVEL_LABELS: Record<number, string> = {
    1:  'Newcomer',
    2:  'Gaining Traction',
    3:  'Consistent',
    4:  'Dedicated',
    5:  'Disciplined',
    6:  'Focused',
    7:  'Unstoppable',
    8:  'Elite',
    9:  'Legendary',
    10: 'Master',
};

function levelLabel(level: number): string {
    return LEVEL_LABELS[level] ?? `Level ${level}`;
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={0.3}
            flex={1}
        >
            <Box display="flex" alignItems="center" gap={0.5} color="text.secondary">
                {icon}
                <Typography fontSize="0.7rem" color="text.secondary" lineHeight={1}>
                    {label}
                </Typography>
            </Box>
            <Typography fontSize="1.1rem" fontWeight={700}>
                {value}
            </Typography>
        </Box>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function XPCard() {
    const { data: stats, isLoading } = useXPStats();
    const [xpTooltipOpen, setXpTooltipOpen] = useState(false);

    if (isLoading || !stats) {
        return (
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: 3,
                    p: 2.5,
                    bgcolor: (t) => alpha(t.palette.secondary.main, 0.06),
                    border: (t) => `1px solid ${alpha(t.palette.secondary.main, 0.18)}`,
                }}
            >
                <Skeleton variant="text" width="50%" height={28} />
                <Skeleton variant="rectangular" height={10} sx={{ my: 1.5, borderRadius: 5 }} />
                <Skeleton variant="text" width="35%" height={20} />
                <Skeleton variant="text" width="70%" sx={{ mt: 2 }} />
            </Box>
        );
    }

    const { total_xp, level, xp_into_level, xp_for_level, pct_to_next, longest_streak, longest_streak_unit, completed_periods } = stats;
    const progressPct = Math.round(pct_to_next * 100);

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 420,
                borderRadius: 3,
                p: 2.5,
                bgcolor: (t) => alpha(t.palette.secondary.main, 0.06),
                border: (t) => `1px solid ${alpha(t.palette.secondary.main, 0.18)}`,
            }}
        >
            {/* ── Level badge + total XP ── */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                <Box>
                    <Typography
                        fontSize="0.88rem"
                        fontWeight={600}
                        color="secondary"
                        letterSpacing={0.8}
                        textTransform="uppercase"
                    >
                        Level {level}
                    </Typography>
                    <Typography fontSize="1.1rem" fontWeight={700} lineHeight={1.2}>
                        {levelLabel(level)}
                    </Typography>
                </Box>
                <Box textAlign="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.4}>
                        <Typography fontSize="0.85rem" color="text.secondary">
                            Total XP
                        </Typography>
                        <ClickAwayListener onClickAway={() => setXpTooltipOpen(false)}>
                            <Tooltip
                                title="XP is awarded at the end of each week. Stay consistent to earn more!"
                                open={xpTooltipOpen}
                                onClose={() => setXpTooltipOpen(false)}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                arrow
                                placement="left"
                                componentsProps={{ tooltip: { sx: { fontSize: '0.82rem' } } }}
                            >
                                <InfoOutlinedIcon
                                    onClick={() => setXpTooltipOpen((v) => !v)}
                                    sx={{ fontSize: '1.05rem', color: 'text.disabled', cursor: 'pointer' }}
                                />
                            </Tooltip>
                        </ClickAwayListener>
                    </Box>
                    <Typography fontSize="1.25rem" fontWeight={800} color="secondary.main">
                        {total_xp.toLocaleString()}
                    </Typography>
                </Box>
            </Box>

            {/* ── Progress bar ── */}
            <LinearProgress
                variant="determinate"
                value={progressPct}
                color="secondary"
                sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: (t) => alpha(t.palette.secondary.main, 0.15),
                    '& .MuiLinearProgress-bar': { borderRadius: 5 },
                    mb: 0.75,
                }}
            />
            <Typography fontSize="0.72rem" color="text.secondary" textAlign="right">
                {xp_into_level.toLocaleString()} / {xp_for_level.toLocaleString()} XP &nbsp;·&nbsp; to Level {level + 1}
            </Typography>

            <Divider sx={{ my: 2, opacity: 0.4 }} />

            {/* ── Stats row ── */}
            <Box display="flex" justifyContent="space-around">
                <StatPill
                    icon={<WhatshotIcon sx={{ fontSize: '0.85rem' }} />}
                    label="Longest streak"
                    value={`${longest_streak}${longest_streak_unit.toLowerCase()}`}
                />
                <Divider orientation="vertical" flexItem sx={{ opacity: 0.4 }} />
                <StatPill
                    icon={<CheckCircleOutlineIcon sx={{ fontSize: '0.85rem' }} />}
                    label="Periods completed"
                    value={completed_periods}
                />
            </Box>
        </Box>
    );
}
