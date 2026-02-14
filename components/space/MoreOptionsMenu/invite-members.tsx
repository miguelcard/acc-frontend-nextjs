'use client';
import { FormikStep, FormikStepper } from '@/components/shared/FormikStepper/formik-stepper';
import Box from '@mui/material/Box';
import { Autocomplete } from 'formik-mui';
import { Field, FormikContextType, FormikValues, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { object, string } from 'yup';
import { createSpaceRole, getUsernameEmailSuggestions } from '@/lib/actions';
import { PaginatedResponse } from '@/lib/types-and-constants';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface InviteMembersProps {
    spaceId: number;
    handleCloseDialog?: () => void;
    handleToastOpen?: () => void;
    children?: React.ReactNode;
}

interface UsernameResult {
    id: number;
    username: string;
}

/**
 * Component using the FormikStepper to add members/users to the space
 * @param space
 * @returns
 */
export function InviteMembers({ spaceId, handleCloseDialog, handleToastOpen, children }: InviteMembersProps) {
    
    const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>();

    /**
     * Fetches the usernames and emails that match with what the user is typing in the field
     * Then the matched strings are put on a state -> autocompleteOptions
     */
    const fetchOptions = async (event: React.ChangeEvent<any>, value: string | null) => {
        if (!value) {
            setAutocompleteOptions([]);
            return;
        }

        // Make a request to the backend to fetch the possible values based on value
        const pageLength: number = 5;
        const paginatedUsersList: PaginatedResponse<UsernameResult> = await getUsernameEmailSuggestions(value, pageLength);

        if (paginatedUsersList?.error) {
            console.log('error getting user suggestions: ', paginatedUsersList.error);
            setErrorMessage('Error getting user suggestions, please try again later.');
            setAutocompleteOptions([]);
        }

        const suggestedUsersResult: UsernameResult[] = paginatedUsersList.results;

        // Loop of the results and add the usernames or emails that match the value to a list
        const autocompleteOptionsList: string[] = [];

        suggestedUsersResult?.forEach((result) => {
            if (result.username.includes(value)) {
                autocompleteOptionsList.push(result.username);
            }
        });

        setAutocompleteOptions(autocompleteOptionsList);
    };

    /**
     * Submits the request to the server action which adds the user to a space / creates a SpaceRole
     */
    async function submitAddUserToSpace(values: FormikValues, spaceId: number) {
        // add extra values that are required in the request
        values.space = spaceId;
        // harcoded for now, another option would be to add the user with the role "admin", users with admin role can manage (update) other spaceroles, and would be also able to delete them.
        values.role = 'member';

        const createdSpaceRole = await createSpaceRole(values, spaceId);

        if (createdSpaceRole?.error) {
            setErrorMessage(createdSpaceRole.error);
            console.log('error while creating spacerole / adding user to space: ', createdSpaceRole.error);
            return;
        }

        // Show a toast message if the user was added sucesfully
        // callback called it if its not undefined
        handleToastOpen?.();
        // callback called if not undefined
        handleCloseDialog?.();
    }

    return (
        <>
            {children && (
                <Box mb={2}>
                    {children}
                </Box>
            )}
            <Typography variant="subtitle2" fontWeight={600} pb={1}>
                Invite New Member
            </Typography>
            <FormikStepper
                initialValues={{
                    username_email: '',
                }}
                onSubmit={async (values) => submitAddUserToSpace(values, spaceId)}
                step={0}
                setStep={() => {}} // empty function, not needed
                submitButtonText="Invite"
            >
                {/* or just an error shown if a non existent one is tried to be inputed */}
                <FormikStep
                    validationSchema={object({
                        username_email: string().required('Value is required'),
                    })}
                >
                    <Box paddingBottom={2}>
                        <Field
                            fullWidth
                            name="username_email"
                            component={Autocomplete}
                            onInputChange={fetchOptions}
                            label="Username or Email"
                            freeSolo
                            options={autocompleteOptions}
                            // ther renderOption is just added to prevent some warnings in the console, see https://stackoverflow.com/questions/75818761/material-ui-autocomplete-warning-a-props-object-containing-a-key-prop-is-be
                            renderOption={(props: any, option: any) => {
                                return (
                                    <li {...props} key={option}>
                                        {option}
                                    </li>
                                );
                            }}
                            renderInput={(params: any) => {
                                const keyProp = `${params.InputLabelProps.htmlFor}-${params.id}`;
                                const { InputLabelProps, id, ...inputProps } = params;

                                // We use the formikCtx in order to get the error messages from the Yup validation schema
                                // and to set the free typed value to be controlled by the formik state = gets formik validation too & is set correctly
                                const { errors, setFieldValue }: FormikContextType<FormikValues> = useFormikContext();

                                return (
                                    <TextField
                                        name="input"
                                        key={keyProp}
                                        {...inputProps}
                                        label="Username or Email"
                                        error={Boolean(errors.username_email)}
                                        helperText={errors.username_email || ''}
                                        onBlur={() => setFieldValue('username_email', inputProps.inputProps.value)}
                                    />
                                );
                            }}
                        />
                    </Box>
                </FormikStep>
            </FormikStepper>
            {errorMessage ? (
                <Typography width="100%" display="inline-flex" justifyContent="center" color="error.light">
                    {errorMessage}
                </Typography>
            ) : null}
        </>
    );
}
