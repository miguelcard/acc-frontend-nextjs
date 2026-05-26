'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import { buildPendingTransitionAlertMessage, buildTransitionSnackbarMessage, getPendingTransition, getTimeframeChangeHint } from '@/lib/utils/timeframe-hint-utils';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Field, FormikConsumer, FormikValues } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import { number, object, string } from 'yup';
import { usePatchHabit } from '@/lib/hooks/mutations';
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

    const patchHabitMutation = usePatchHabit(habit.spaces?.[0] ?? 0);

    async function submitEditHabit(values: FormikValues, habitId: number) {
        const patchedHabit = {
            description: values.description,
            times: values.times,
            time_frame: values.time_frame,
        };
        const updatedHabit: HabitT = await patchHabitMutation.mutateAsync({ newHabitData: patchedHabit, id: habitId });

        if (updatedHabit?.error) {
            console.log('error message: ', updatedHabit.error);
            return;
        }

        if (updatedHabit?.config_transition) {
            toast(buildTransitionSnackbarMessage(updatedHabit.config_transition), { duration: 6000 });
        }

        handleCloseDialog?.();
    }

    return (
        <FormikStepper
            initialValues={{
                description: habit.description,
                times: habit.times,
                time_frame: habit.time_frame,
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
                            .when('time_frame', {
                                is: 'W',
                                then: (schema) => schema.max(7, 'Times must be ≤ 7 for a weekly habit'),
                                otherwise: (schema) => schema.max(31, 'Times must be ≤ 31 for a monthly habit'),
                            })
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
                                    autoFocus
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
                            <Field name="time_frame">
                                {({ field, form, meta }: any) => (
                                    <TextField
                                        {...field}
                                        select
                                        fullWidth
                                        label="Time Frame"
                                        variant="standard"
                                        helperText="Please select time frame for the habit"
                                        error={meta.touched && Boolean(meta.error)}
                                        onChange={(e) => {
                                            // Use setFieldValue directly (not field.onChange) so
                                            // the new time_frame is committed to Formik state before
                                            // we trigger validation. field.onChange enqueues an update
                                            // that may not be flushed by the time a bare validateField
                                            // runs in setTimeout, causing a race condition.
                                            form.setFieldValue('time_frame', e.target.value, false);
                                            // After one tick the new time_frame value is committed.
                                            // setFieldTouched with shouldValidate=true both marks
                                            // 'times' as touched (so the error becomes visible) and
                                            // runs full validation against the updated time_frame.
                                            setTimeout(() => form.setFieldTouched('times', true, true), 0);
                                        }}
                                    >
                                        {timeFrames.map((option, index) => (
                                            <MenuItem key={index} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            </Field>
                            {/* Inline hint when user changes time_frame */}
                            <FormikConsumer>
                                {({ values }) => {
                                    const today = new Date();
                                    const hint = getTimeframeChangeHint(habit, values.time_frame as string, today);
                                    // Show the pending-transition alert only when the dropdown still
                                    // matches the saved habit.time_frame (i.e. the user hasn't changed
                                    // it yet). This correctly suppresses the alert in the revert case
                                    // (e.g. W→M saved, user selects W again) where getTimeframeChangeHint
                                    // also returns null — using !hint alone would conflate that case
                                    // with "no change" and show a stale pending message.
                                    const pending = values.time_frame === habit.time_frame
                                        ? getPendingTransition(habit, today)
                                        : null;
                                    const pendingMsg = pending
                                        ? buildPendingTransitionAlertMessage(pending)
                                        : null;
                                    return (
                                        <>
                                            {hint && (
                                                <Alert severity="info" sx={{ mt: 1, fontSize: '0.8rem' }}>
                                                    {hint}
                                                </Alert>
                                            )}
                                            {pendingMsg && (
                                                <Alert severity="info" sx={{ mt: 1, fontSize: '0.8rem' }}>
                                                    {pendingMsg}
                                                </Alert>
                                            )}
                                        </>
                                    );
                                }}
                            </FormikConsumer>
                        </Box>
                        {/* =================== habits recurrence in time frame */}
                        <Box
                            component={'div'}
                            sx={{ width: { xs: '100%', sm: '48%' } }}
                        >
                            <FormikConsumer>
                                {({ values }) => {
                                    const isWeekly = values.time_frame === 'W';
                                    return (
                                        <Field
                                            fullWidth
                                            name="times"
                                            label={`Times per ${isWeekly ? 'week' : 'month'}`}
                                            type="number"
                                            variant="standard"
                                            component={TextFieldFormikMui}
                                        />
                                    );
                                }}
                            </FormikConsumer>
                        </Box>
                    </Box>
                </FormikStep>
        </FormikStepper>
    );
}
