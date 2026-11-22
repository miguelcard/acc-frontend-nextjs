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
            {/* No "Sign up" button: signup is invite-only (reached through an invite link). */}
            <AuthNavbar />
            {children}
        </>
    );
}
