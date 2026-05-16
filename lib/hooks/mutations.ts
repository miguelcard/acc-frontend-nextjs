/**
 * Mutation hooks — wrap every write operation (POST/PATCH/DELETE) and
 * automatically invalidate the relevant cached queries on success.
 */
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import {
    createSpace,
    patchSpace,
    createHabit,
    patchHabit,
    deleteHabit,
    createSpaceRole,
    deleteSpaceRole,
    removeUserFromSpace,
    updateSpaceRole,
    patchUser,
    addCheckmark,
    deleteCheckmark,
} from '@/lib/fetch-mutations';
import { FormikValues } from 'formik';
import { CreateHabitT, CheckMarkT, HabitT } from '@/lib/types-and-constants';

// ────────────────────────────────────────────────────────────
// Spaces
// ────────────────────────────────────────────────────────────

export function useCreateSpace() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormikValues) => createSpace(formData),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.spaces });
        },
    });
}

export function usePatchSpace(spaceId: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ formData, id }: { formData: FormikValues; id: number }) =>
            patchSpace(formData, id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.space(spaceId) });
            qc.invalidateQueries({ queryKey: queryKeys.spaces });
        },
    });
}

// ────────────────────────────────────────────────────────────
// Habits
// ────────────────────────────────────────────────────────────

export function useCreateHabit(spaceId: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (habit: CreateHabitT) => createHabit(habit),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.space(spaceId) });
            qc.invalidateQueries({ queryKey: queryKeys.spaces });
            qc.invalidateQueries({ queryKey: queryKeys.recurrentHabits });
            // Invalidate all checkmark queries for this space
            qc.invalidateQueries({ queryKey: queryKeys.spaceCheckmarks(spaceId) });
        },
    });
}

export function usePatchHabit(spaceId: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ newHabitData, id }: { newHabitData: any; id: number }) =>
            patchHabit(newHabitData, id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.space(spaceId) });
            qc.invalidateQueries({ queryKey: queryKeys.recurrentHabits });
            qc.invalidateQueries({ queryKey: queryKeys.spaceCheckmarks(spaceId) });
            // Config changes trigger XP settlement — refresh the Profile XP display.
            qc.invalidateQueries({ queryKey: queryKeys.xpStats });
        },
    });
}

export function useDeleteHabit(spaceId: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (habit: HabitT) => deleteHabit(habit),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.space(spaceId) });
            qc.invalidateQueries({ queryKey: queryKeys.spaces });
            qc.invalidateQueries({ queryKey: queryKeys.recurrentHabits });
            qc.invalidateQueries({ queryKey: queryKeys.spaceCheckmarks(spaceId) });
        },
    });
}

// ────────────────────────────────────────────────────────────
// Space Roles (invite / leave / remove / promote)
// ────────────────────────────────────────────────────────────

export function useCreateSpaceRole(spaceId: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ formData }: { formData: FormikValues }) =>
            createSpaceRole(formData, spaceId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.space(spaceId) });
            qc.invalidateQueries({ queryKey: queryKeys.spaceMembers(spaceId) });
        },
    });
}

export function useDeleteSpaceRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (spaceId: number) => deleteSpaceRole(spaceId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.spaces });
            qc.invalidateQueries({ queryKey: queryKeys.recurrentHabits });
        },
    });
}

export function useRemoveUserFromSpace(spaceId: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ userId }: { userId: number }) =>
            removeUserFromSpace(spaceId, userId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.spaceMembers(spaceId) });
            qc.invalidateQueries({ queryKey: queryKeys.space(spaceId) });
        },
    });
}

export function useUpdateSpaceRole(spaceId: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ spaceroleId, role }: { spaceroleId: number; role: string }) =>
            updateSpaceRole(spaceroleId, role, spaceId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.spaceMembers(spaceId) });
        },
    });
}

// ────────────────────────────────────────────────────────────
// User
// ────────────────────────────────────────────────────────────

export function usePatchUser() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormikValues) => patchUser(formData),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.user });
        },
    });
}

// ────────────────────────────────────────────────────────────
// Checkmarks
// ────────────────────────────────────────────────────────────

export function useAddCheckmark(spaceId: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (checkmark: { habit: number; status: string; date: string; client_date: string }) =>
            addCheckmark(checkmark),
        onSuccess: () => {
            // Invalidate the space query so space_habits (with embedded checkmarks) are refreshed on next mount
            qc.invalidateQueries({ queryKey: queryKeys.space(spaceId) });
            qc.invalidateQueries({ queryKey: queryKeys.spaceCheckmarks(spaceId) });
            // Also invalidate recurrentHabits so "All Habits" page reflects the change
            // on next visit, and streak badges are refreshed.
            qc.invalidateQueries({ queryKey: queryKeys.recurrentHabits });
            // Invalidate XP stats so the Profile page reflects newly awarded XP immediately.
            qc.invalidateQueries({ queryKey: queryKeys.xpStats });
        },
    });
}

export function useDeleteCheckmark(spaceId: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (checkmark: CheckMarkT) => deleteCheckmark(checkmark),
        onSuccess: () => {
            // Invalidate the space query so space_habits (with embedded checkmarks) are refreshed on next mount
            qc.invalidateQueries({ queryKey: queryKeys.space(spaceId) });
            qc.invalidateQueries({ queryKey: queryKeys.spaceCheckmarks(spaceId) });
            // Also invalidate recurrentHabits so "All Habits" page reflects the change
            // on next visit, and streak badges are refreshed.
            qc.invalidateQueries({ queryKey: queryKeys.recurrentHabits });
            // Invalidate XP stats so the Profile page reflects XP changes immediately.
            qc.invalidateQueries({ queryKey: queryKeys.xpStats });
        },
    });
}
