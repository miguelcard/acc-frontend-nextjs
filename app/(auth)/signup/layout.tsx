import AuthNavbar from "@/components/auth/AuthNavbar/auth-navbar";
import CssBaseline from "@mui/material/CssBaseline";


export default function SignupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CssBaseline/>
            <AuthNavbar
                actionMessage={`Already have an account?`}
                buttonLinkTo={'/login'}
                buttonKey={'login'}
                buttonText={'Log In'} />
            {children}
        </>
    );
}