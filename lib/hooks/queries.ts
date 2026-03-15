/**
 * Query hooks — wrap every read operation (GET) with caching,
 * deduplication, and automatic refetching via React Query.
 */
'use client';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { getUser, getSpace, getUserSpaces, getUsersFromSpace, getAllUserRecurrentHabits } from '@/lib/fetch-queries';
import { getAllHabitsAndCheckmarksFromSpace } from '@/lib/fetch-mutations';
import { useAuth } from '@/lib/auth/auth-context';

// ────────────────────────────────────────────────────────────
// User
// ────────────────────────────────────────────────────────────
export function useUser() {
    const { user: firebaseUser, loading: authLoading } = useAuth();
    return useQuery({
        queryKey: queryKeys.user,
        queryFn: getUser,
        enabled: !authLoading && !!firebaseUser,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// ────────────────────────────────────────────────────────────
// Spaces
// ────────────────────────────────────────────────────────────
export function useUserSpaces() {
    const { user: firebaseUser, loading: authLoading } = useAuth();
    return useQuery({
        queryKey: queryKeys.spaces,
        queryFn: getUserSpaces,
        enabled: !authLoading && !!firebaseUser,
        staleTime: 2 * 60 * 1000,
    });
}

export function useSpace(id: number) {
    const { user: firebaseUser, loading: authLoading } = useAuth();
    return useQuery({
        queryKey: queryKeys.space(id),
        queryFn: () => getSpace(id),
        enabled: !authLoading && !!firebaseUser && id > 0,
        staleTime: 2 * 60 * 1000,
    });
}

// ────────────────────────────────────────────────────────────
// Space members
// ────────────────────────────────────────────────────────────
export function useSpaceMembers(spaceId: number, limit: number) {
    const { user: firebaseUser, loading: authLoading } = useAuth();
    return useQuery({
        queryKey: queryKeys.spaceMembers(spaceId, limit),
        queryFn: () => getUsersFromSpace(spaceId, limit),
        enabled: !authLoading && !!firebaseUser && spaceId > 0,
        staleTime: 2 * 60 * 1000,
    });
}

// ────────────────────────────────────────────────────────────
// Space checkmarks (date-range pagination)
// ────────────────────────────────────────────────────────────
export function useSpaceCheckmarks(spaceId: number, dateRange: string) {
    const { user: firebaseUser, loading: authLoading } = useAuth();
    return useQuery({
        queryKey: queryKeys.spaceCheckmarks(spaceId, dateRange),
        queryFn: () => getAllHabitsAndCheckmarksFromSpace(spaceId, dateRange),
        enabled: !authLoading && !!firebaseUser && spaceId > 0 && !!dateRange,
        staleTime: 2 * 60 * 1000,
    });
}

// ────────────────────────────────────────────────────────────
// Habits
// ────────────────────────────────────────────────────────────
export function useAllRecurrentHabits() {
    const { user: firebaseUser, loading: authLoading } = useAuth();
    return useQuery({
        queryKey: queryKeys.recurrentHabits,
        queryFn: getAllUserRecurrentHabits,
        enabled: !authLoading && !!firebaseUser,
        staleTime: 2 * 60 * 1000,
    });
}
