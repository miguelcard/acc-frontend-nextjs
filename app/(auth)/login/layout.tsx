import AuthNavbar from "@/components/auth/AuthNavbar/auth-navbar";
import CssBaseline from "@mui/material/CssBaseline";


export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CssBaseline/>
            <AuthNavbar
                actionMessage={`Don't have an account?`}
                buttonLinkTo={'/signup'}
                buttonKey={'signup'}
                buttonText={'Sign up'} />
            {children}
        </>
    );
}