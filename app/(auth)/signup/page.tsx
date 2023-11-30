'use client';
import { FormValues, initialValues } from "@/components/auth/SignupForms/constants";
import SignupFirstForm from "@/components/auth/SignupForms/signup-first-form";
import SignupSecondForm from "@/components/auth/SignupForms/signup-second-form";
import { signUp } from "@/lib/actions";
import signupValidationSchemas from "@/components/auth/SignupForms/form-validation-schemas";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";

export default function SignUp() {

    const [step, setStep] = useState<number>(1);
    const [formValues, setFormValues] = useState<FormValues>(initialValues);
    const [isLastStep, setIsLastStep] = useState<boolean>(false);
    const [signupError, setSignupError] = useState<string>();
    const router = useRouter();

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: signupValidationSchemas[step - 1],
        onSubmit: (values: FormValues, { setSubmitting }: any) => {
            handleFormsSubmit(values);
            setSubmitting(false);
        },
    });

    const handleFormsSubmit = (values: FormValues) => {
        switch (step) {
            case 1:
                setFormValues(values);
                setStep(2);
                break;
            case 2:
                setFormValues({ ...formValues, ...values }); // use state in react is Asynchronous! meaning that if you send the request right after you can send the old form values before the new ones are given! 
                setIsLastStep(true);
                break;
        }
    }

    // We use the useEffect hook before sending the request to ensure the latest formValues are sent
    useEffect(() => {
        async function registerUser() {
            if (isLastStep) {
                const formData = new FormData();
                formData.append('name', formValues.name);
                formData.append('email', formValues.email);
                formData.append('username', formValues.username);
                formData.append('password', formValues.password);
                // we send the same password twice because the backend expects 2 matching passwords and to keep the frontend form simple, we only ask for the password once
                formData.append('password2', formValues.password);

                const res: NextResponse | any = await signUp(formData);
                if (res?.error) {
                    setSignupError(res.error);
                    // sue user id to fetch users data and redirect to users page...
                }
            }
        }

        registerUser();

    }, [formValues, isLastStep]);

    return (
        <>
            {step === 1 && <SignupFirstForm formik={formik} />}
            {step === 2 && (
                <SignupSecondForm formik={formik} />
            )}
            {signupError ?
                <Typography
                    sx={{ p: 3 }}
                    width='100%'
                    display='inline-flex'
                    justifyContent='center'
                    color='error.light'
                    children={signupError}
                />
                : null}
        </>
    )
}