'use client';
import { FormikStep, FormikStepper } from "@/components/shared/FormikStepper/formik-stepper";
import UserAvatarSelector from "./user-avatar-selector";
import { UserT } from "@/lib/types-and-constants";
import { FormikValues } from "formik";
import { patchUser } from "@/lib/actions";

interface Props {
    user: UserT;
    handleCloseDialog?: () => void;
}

export default function ChangeUserAvatarFormikStepper({ user, handleCloseDialog }: Props) {

    /**
     * Submits values to the server action which patches the user
     */
    async function submitPatchUser(values: FormikValues) {
        
        const updatedUser: UserT = await patchUser(values);
        if (updatedUser?.error) {
            // setErrorMessage(user.error); // this would be to put an error in the UI, should I?
            console.log('error message: ', updatedUser.error);
            return;
        }

        if (handleCloseDialog !== undefined) {
            handleCloseDialog();
        }
    }


    return (
        <FormikStepper
            initialValues={{
                avatar_seed: `${user.avatar_seed}`,
            }}
            onSubmit={async (values) => submitPatchUser(values)}
            step={0}
            setStep={() => console.info('setStep is undefined')}
        >
            <FormikStep>
                <UserAvatarSelector user={user} />
            </FormikStep>
        </FormikStepper>
    )
}
