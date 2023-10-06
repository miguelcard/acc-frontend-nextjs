import AuthNavbar from "@/components/auth/AuthNavbar/auth-navbar";


export default function SignupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <AuthNavbar
                actionMessage={`Already have an account?`}
                buttonLinkTo={'/login'}
                buttonKey={'login'}
                buttonText={'Log In'} />
            {children}
        </>
    );
}