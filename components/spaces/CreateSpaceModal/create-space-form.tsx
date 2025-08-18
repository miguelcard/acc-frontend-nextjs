'use client';
import Box from '@mui/material/Box';
import { Field, FormikValues } from 'formik';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import React, { useState } from 'react';
import { object, string } from 'yup';
import { TextField as TextFieldFormikMui } from 'formik-mui';
import TextField from '@mui/material/TextField';
import { createSpace } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import Typography from '@mui/material/Typography';
import { EmojiSelector } from '@/components/space/EmojiSelector/emoji-selector';
import Link from '@mui/material/Link';
import NextLink from 'next/link';

async function submitCreateSpace(
    values: FormikValues,
    router: AppRouterInstance | string[],
    setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>
) {
    const space = await createSpace(values);
    if (space?.error) {
        setErrorMessage(space.error);
        console.log('error message: ', space.error);
        return;
    }

    router.push(`/spaces/${space.id}`);
}

interface CreateSpaceFormProps {
    step?: number | undefined;
    setStep?: undefined | React.Dispatch<React.SetStateAction<number>>;
}

export default function CreateSpaceForm({ step, setStep }: CreateSpaceFormProps) {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string>();

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <FormikStepper
                initialValues={{
                    name: '',
                    icon_alias: null,
                    description: '',
                }}
                onSubmit={async (values) => submitCreateSpace(values, router, setErrorMessage)}
                step={step === undefined ? 0 : step}
                setStep={setStep === undefined ? () => console.warn('setStep is undefined!') : setStep}
            >
                <FormikStep
                    validationSchema={object({
                        name: string().max(32).required('Space name is required'),
                    })}
                >
                    <Box paddingBottom={2}>
                        <Field fullWidth name="name" component={TextFieldFormikMui} label="Space Name" variant="standard" />
                    </Box>

                    <Typography fontSize={"0.8em"} >
                        <Link href="/how-to-join-spaces" underline="hover" color='secondary' component={NextLink}>
                            {'Trying to join an existing space instead?'}
                        </Link>
                    </Typography>
                </FormikStep>
                <FormikStep>
                    <EmojiSelector title="Choose a space avatar..." />
                </FormikStep>
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
                                    placeholder="Describe your space"
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
                {/* TODO step to add other users to your space by UN /  PW -> InviteMembers Component */}
            </FormikStepper>
            {errorMessage &&
                <Typography width="100%" display="inline-flex" justifyContent="center" color="error.light" whiteSpace='pre-line' >
                    {errorMessage}
                </Typography>
            }
        </Box>
    );
}
