'use client';
import { FormikStep, FormikStepper } from "@/components/shared/FormikStepper/formik-stepper";
import { useAuth } from "@/lib/auth/auth-context";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutFormikStepper() {
    
    const [errorMessage, setErrorMessage] = useState<string>();
    const router = useRouter();
    const { signOut } = useAuth();
    const queryClient = useQueryClient();

    /**
     * Signs out the current Firebase user and redirects to login
     */
    async function submitLogout() {
        try {
            await signOut();
            // Drop the previous user's cached data; the app signs in a fresh anonymous user.
            queryClient.clear();
            router.push(`/login`);
        } catch (error) {
            setErrorMessage('Unable to log out, please try again later.');
            console.log('error while logging out: ', error);
        }
    }

    return (
        <>
            <FormikStepper
                initialValues={{
                }}
                onSubmit={async () => submitLogout()}
                step={0}
                setStep={() => {}}
                submitButtonText="Log out"
                buttonColorVariant='secondary'
            >
                <FormikStep>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column"
                        paddingBottom={2}
                    >
                        {errorMessage ? (
                            <Typography width="100%" display="inline-flex" justifyContent="center" color="error.light">
                                {errorMessage}
                            </Typography>
                        ) :
                            <Typography color={'black'} fontSize={'0.9em'} align='left' >
                                Are you sure you want to log out? You can sign back in with your email and password.
                            </Typography>}
                    </Box>
                </FormikStep>
            </FormikStepper>
        </>
    );
}