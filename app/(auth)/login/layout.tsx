import AuthNavbar from "@/components/auth/AuthNavbar/auth-navbar";


export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <AuthNavbar
                actionMessage={`Don't have an account?`}
                buttonLinkTo={'/signup'}
                buttonKey={'signup'}
                buttonText={'Sign up'} />
            {children}
        </>
    );
}