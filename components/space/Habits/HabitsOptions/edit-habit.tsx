'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Field, FormikValues } from 'formik';
import React, { useState } from 'react';
import { number, object, string } from 'yup';
import { patchHabit } from '@/lib/actions';
import { HabitT, timeFrames } from '@/lib/types-and-constants';
import { TextField as TextFieldFormikMui } from 'formik-mui';
import { MenuItem } from '@mui/material';

interface EditHabitProps {
    habit: HabitT;
    handleCloseDialog?: () => void;
}

/**
 * Component using the FormikStepper to edit the description of the habit
 * @param habit
 * @returns
 */
export function EditHabit({ habit, handleCloseDialog }: EditHabitProps) {
    const [habitDescripton, setHabitDescripton] = useState<string | undefined>(habit.description);

    const [habitTimes, setHabitTimes] = useState<number>(habit.times);
    const [habitTimeFrame, setHabitTimeFrame] = useState<string>(habit.time_frame);

    /**
     * Submits the request to the server action which patches the habit
     */
    async function submitEditHabit(values: FormikValues, habitId: number) {
        const newHabit = {
            title: habit.title,
            description: values.description,
            times: values.times,
            time_frame: values.time_frame,
            spaces: habit.spaces,
        };
        const updatedHabit: HabitT = await patchHabit(newHabit, habitId);

        if (updatedHabit?.error) {
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
                    times: habitTimes,
                    time_frame: habitTimeFrame,
                }}
                onSubmit={async (values) => submitEditHabit(values, habit.id)}
                step={0}
                setStep={() => console.info('setStep is undefined')}
            >
                {/* =================== Discriptions */}
                <FormikStep
                    validationSchema={object({
                        description: string().max(220, 'A maximum of 220 characters is allowed'),
                        time_frame: string().required('Time Frame is required'),
                        times: number()
                            .integer()
                            .min(1)
                            .max(habit.time_frame === 'W' ? 7 : 31)
                            .required('Times is required'),
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

                    <Box component={'div'} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {/* =================== Time frame */}
                        <Box component={'div'} sx={{ width: { xs: '100%', sm: '48%' } }}>
                            <Field
                                fullWidth
                                select
                                name="time_frame"
                                label="Time Frame"
                                defaultValue="W"
                                helperText="Please select time frame for the habit"
                                variant="standard"
                                component={TextFieldFormikMui}
                            >
                                {timeFrames.map((option, index) => (
                                    <MenuItem key={index} value={option.value} onClick={() => setHabitTimeFrame(option.value)}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Field>
                        </Box>
                        {/* =================== habits recurrence in time frame */}
                        <Box
                            component={'div'}
                            sx={{ width: { xs: '100%', sm: '48%' } }}
                            onChange={(e: any) => setHabitTimes(parseInt(e.target.value))}
                        >
                            <Field
                                fullWidth
                                name="times"
                                label={`Times per ${habitTimeFrame === 'W' ? 'week' : 'month'}`}
                                type="number"
                                variant="standard"
                                min={1}
                                max={habitTimeFrame === 'W' ? 7 : 31}
                                component={TextFieldFormikMui}
                            />
                        </Box>
                    </Box>
                </FormikStep>
            </FormikStepper>
        </>
    );
}
