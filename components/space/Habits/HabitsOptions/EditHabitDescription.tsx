'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Field, FormikValues } from 'formik';
import React, { useState } from 'react';
import { object, string } from 'yup';
import { patchHabit } from '@/lib/actions';
import { HabitT } from '@/lib/types-and-constants';
import { TextField as TextFieldFormikMui } from 'formik-mui';

interface EditHabitDescriptionProps {
    habit: HabitT;
    handleCloseDialog?: () => void;
}

/**
 * Component using the FormikStepper to edit the description of the habit
 * @param habit
 * @returns
 */
export function EditHabitDescription({ habit, handleCloseDialog }: EditHabitDescriptionProps) {
    const [habitDescripton, setHabitDescripton] = useState<string | undefined>(habit.description);

    /**
     * Submits the request to the server action which patches the habit
     */
    async function submitEditHabit(values: FormikValues, habitId: number) {
        const newHabit = {
            title: habit.title,
            description: values.description,
            times: habit.times,
            time_frame: habit.time_frame,
            spaces: habit.spaces,
        };
        const updatedHabit: HabitT = await patchHabit(newHabit, habitId);

        if (updatedHabit?.error) {
            // setErrorMessage(habit.error); // this would be to put an error in the UI, should I?
            console.log('error message: ', updatedHabit.error);
            return;
        }
        setHabitDescripton(updatedHabit.description);
        if (handleCloseDialog !== undefined) {
            handleCloseDialog();
        }
    }

    return (
        <>
            <FormikStepper
                initialValues={{
                    description: habitDescripton,
                }}
                onSubmit={async (values) => submitEditHabit(values, habit.id)}
                step={0}
                setStep={() => console.info('setStep is undefined')}
            >
                {/* =================== Discriptions */}
                <FormikStep
                    validationSchema={object({
                        description: string().max(220, 'A maximum of 220 characters is allowed'),
                    })}
                >
                    <Box paddingBottom={2}>
                        {/* for this field the normal MUI TextField is used in order to allow validation on change, which was not supported out of the box from the formik-mui library */}
                        <Field name="description">
                            {({ field, form, meta }: any) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="text"
                                    name="description"
                                    label="Description"
                                    placeholder="A description for your Habit"
                                    autoComplete="null"
                                    spellCheck="false"
                                    onFocus={() => form.setFieldTouched(field.name, true)}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={meta.touched && Boolean(meta.error)}
                                    helperText={meta.touched && meta.error}
                                    multiline
                                    maxRows={6}
                                />
                            )}
                        </Field>
                    </Box>
                </FormikStep>
            </FormikStepper>
        </>
    );
}
