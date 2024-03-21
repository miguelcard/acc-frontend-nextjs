'use client';
import Box from '@mui/material/Box';
import { Field, FormikHelpers, FormikValues } from 'formik';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
// import { useState } from 'react';
import { object, string } from 'yup';
import { TextField as TextFieldFormikMui } from 'formik-mui';
import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
import { CreateHabitT, timeFrames } from '@/lib/types-and-constants';
import { createHabit } from '@/lib/actions';
import toast from 'react-hot-toast';
import { MenuItem } from '@mui/material';

async function submitNewHabit(value: any, id: number, action: FormikHelpers<FormikValues>) {
    action.setSubmitting(true);
    let habit: CreateHabitT = value;
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
    // const [errorMessage, setErrorMessage] = useState<string>();

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
                    times: undefined,
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
                        title: string().max(20).required('Habit title is required'),
                    })}
                >
                    <Box paddingBottom={2}>
                        <Field fullWidth name="title" label="Title" variant="standard" component={TextFieldFormikMui} />
                    </Box>
                </FormikStep>
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
                <FormikStep
                    validationSchema={object({
                        times: string().required('Times are required'),
                    })}
                >
                    <Box paddingBottom={2}>
                        <Field
                            fullWidth
                            name="times"
                            label="Times"
                            type="number"
                            variant="standard"
                            min={0}
                            component={TextFieldFormikMui}
                        />
                    </Box>
                </FormikStep>
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
                            label="Select"
                            defaultValue="W"
                            helperText="Please select time frame for the habit"
                            variant="standard"
                            component={TextFieldFormikMui}
                        >
                            {timeFrames.map((option, index) => (
                                <MenuItem key={index} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Field>
                    </Box>
                </FormikStep>
                {/* TODO step to add other users to your Habit by UN /  PW -> InviteMembers Component */}
            </FormikStepper>
            {/* {errorMessage ? (
                <Typography
                    width="100%"
                    display="inline-flex"
                    justifyContent="center"
                    color="error.light"
                >
                    {errorMessage}
                </Typography>
            ) : null} */}
        </Box>
    );
}
