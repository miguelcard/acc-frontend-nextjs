import { BottomNavigationLayout } from "@/components/shared/BottomNavigationLayout/bottom-navigation-layout";
import { BlurredBlobBackground } from "@/components/shared/BlurredBlobBackground/blurred-blob-background";
import { UsernameSetupGate } from "@/components/auth/UsernameSetupGate/username-setup-gate";
import Box from "@mui/material/Box";

export default function AuthenticatedLayout({children,}: {children: React.ReactNode;}) {
    return (
        <>
            <Box
                sx={{
                    bgcolor: '#f5f5f5',
                    minHeight: '100vh',
                    position: 'static',
                    overflowX: 'hidden', // only clip horizontal (blob overflow); allow vertical so space header negative-margin can bleed into status bar zone
                }}
            >
                <BlurredBlobBackground />
                <UsernameSetupGate>
                    <BottomNavigationLayout>
                        {children}
                    </BottomNavigationLayout>
                </UsernameSetupGate>
            </Box>
        </>
    );
}