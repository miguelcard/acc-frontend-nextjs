'use client';
import { FormikStep, FormikStepper } from "@/components/shared/FormikStepper/formik-stepper";
import { logout } from "@/lib/actions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutFormikStepper() {
    
    const [errorMessage, setErrorMessage] = useState<string>();
    const router = useRouter();

    /**
     * Submits the request to the server action which deletes the space role
     */
    async function submitLogout() {

        const res = await logout();

        if (res?.error) {
            setErrorMessage('Unable to log out, please try again later.');
            console.log('error while logging out / error: ', res.error);
            return;
        }

        router.push(`/login`);
    }

    return (
        <>
            <FormikStepper
                initialValues={{
                }}
                onSubmit={async (values) => submitLogout()}
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
                                Are you sure you want to log out?
                            </Typography>}
                    </Box>
                </FormikStep>
            </FormikStepper>
        </>
    );
}