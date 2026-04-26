'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import Box from '@mui/material/Box';
import { Field, FormikValues } from 'formik';
import React from 'react';
import { object, string } from 'yup';
import { usePatchHabit } from '@/lib/hooks/mutations';
import { HabitT } from '@/lib/types-and-constants';
import { TextField as TextFieldFormikMui } from 'formik-mui';

interface EditHabitTitleProps {
    habit: HabitT;
    handleCloseDialog?: () => void;
}

/**
 * Component using the FormikStepper to edit the title of the habit
 * @param habit
 * @returns
 */
export function EditHabitTitle({ habit, handleCloseDialog }: EditHabitTitleProps) {
    
    const patchHabitMutation = usePatchHabit(habit.spaces?.[0] ?? 0);

    async function submitEditHabit(values: FormikValues) {
        
        const patchedHabit = {
            title: values.title,
        };

        const updatedHabit: HabitT = await patchHabitMutation.mutateAsync({ newHabitData: patchedHabit, id: habit.id });

        if (updatedHabit?.error) {
            console.log('error message: ', updatedHabit.error);
            return;
        }
        handleCloseDialog?.();
    }

    return (
        <>
            <FormikStepper
                initialValues={{
                    title: habit.title,
                }}
                onSubmit={async (values) => submitEditHabit(values)}
                step={0}
                setStep={() => console.info('setStep is undefined')}
            >
                {/* =================== Title */}
                <FormikStep
                    validationSchema={object({
                        title: string().max(35).required('Habit title is required'),
                    })}
                >
                    <Box paddingBottom={2}>
                        <Field fullWidth name="title" label="Title" variant="standard" component={TextFieldFormikMui} autoFocus />
                    </Box>
                </FormikStep>
            </FormikStepper>
        </>
    );
}
