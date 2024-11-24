'use client';
import Box from '@mui/material/Box';
import { Field, FormikHelpers, FormikValues } from 'formik';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import { number, object, string } from 'yup';
import { TextField as TextFieldFormikMui } from 'formik-mui';
import TextField from '@mui/material/TextField';
import { CreateHabitT, timeFrames } from '@/lib/types-and-constants';
import { createHabit } from '@/lib/actions';
import toast from 'react-hot-toast';
import { MenuItem } from '@mui/material';
import { useState } from 'react';

async function submitNewHabit(value: any, id: number, action: FormikHelpers<FormikValues>) {

    action.setSubmitting(true);
    const habit: CreateHabitT = value;
    habit.spaces = [id];
    const res = await createHabit(habit);
    action.setSubmitting(false);

    if (res?.error) {
        toast.error(res.error);
        console.log('error message: ', res);
        return;
    }

    toast.success(`${res.title} is created successfully`);
}

type CreateHabitFormProps = {
    step?: number;
    setStep?: React.Dispatch<React.SetStateAction<number>>;
    spaceId: number;
    handleCloseDialog?: () => void;
};

export default function CreateHabitForm({ step, setStep, spaceId, handleCloseDialog }: CreateHabitFormProps) {
    
    const [istimeFrameWeekly, setIstimeFrameWeekly] = useState<boolean>(true);

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <FormikStepper
                initialValues={{
                    title: '',
                    description: '',
                    times: 0,
                    time_frame: 'W',
                }}
                onSubmit={async (values, action) => {
                    await submitNewHabit(values, spaceId, action);
                    handleCloseDialog && handleCloseDialog();
                }}
                step={step === undefined ? 0 : step}
                setStep={setStep === undefined ? () => console.warn('setStep is undefined!') : setStep}
            >
                {/* =================== Title */}
                <FormikStep
                    validationSchema={object({
                        title: string().max(70).required('Habit title is required'),
                    })}
                >
                    <Box paddingBottom={2}>
                        <Field fullWidth name="title" label="Title" variant="standard" component={TextFieldFormikMui} />
                    </Box>
                </FormikStep>
                {/* ==== Time frame */}
                <FormikStep
                    validationSchema={object({
                        time_frame: string().required('Time Frame is required'),
                    })}
                >
                    <Box paddingBottom={2}>
                        <Field
                            fullWidth
                            select
                            name="time_frame"
                            label="Time Frame"
                            defaultValue="W"
                            helperText={`Set the desired number of times per ${istimeFrameWeekly ? 'week' : 'month'}`}
                            variant="standard"
                            component={TextFieldFormikMui}
                        >
                            {timeFrames.map((option, index) => (
                                <MenuItem key={index} value={option.value} onClick={() => setIstimeFrameWeekly(option.value === 'W')}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Field>
                    </Box>
                </FormikStep>
                {/* =================== habits recurrence in time frame */}
                <FormikStep
                    validationSchema={object({
                        times: number()
                            .integer()
                            .min(1)
                            .max(istimeFrameWeekly ? 7 : 31)
                            .required('Times is required'),
                    })}
                >
                    <Box paddingBottom={2}>
                        <Field
                            fullWidth
                            name="times"
                            label={`Times per ${istimeFrameWeekly ? 'week' : 'month'}`}
                            type="number"
                            variant="standard"
                            min={1}
                            max={istimeFrameWeekly ? 7 : 31}
                            component={TextFieldFormikMui}
                        />
                    </Box>
                </FormikStep>
                {/* === Description ==== */}
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
                                    label="Description (Optional)"
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
        </Box>
    );
}
