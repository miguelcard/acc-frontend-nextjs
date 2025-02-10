'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import Box from '@mui/material/Box';
import { Field, FormikValues } from 'formik';
import React, { useState } from 'react';
import { object, string } from 'yup';
import { patchHabit } from '@/lib/actions';
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
    
    const [habitTitle, setHabitTitle] = useState<string | undefined>(habit.title);

    /**
     * Submits the request to the server action which patches the habit
     */
    async function submitEditHabit(values: FormikValues) {
        
        const patchedHabit = {
            title: values.title,
        };

        const updatedHabit: HabitT = await patchHabit(patchedHabit, habit.id);

        if (updatedHabit?.error) {
            // setErrorMessage(habit.error); // this would be to put an error in the UI, should I?
            console.log('error message: ', updatedHabit.error);
            return;
        }
        setHabitTitle(updatedHabit.title);
        if (handleCloseDialog !== undefined) handleCloseDialog();
    }

    return (
        <>
            <FormikStepper
                initialValues={{
                    title: habitTitle,
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
                        <Field fullWidth name="title" label="Title" variant="standard" component={TextFieldFormikMui} />
                    </Box>
                </FormikStep>
            </FormikStepper>
        </>
    );
}
