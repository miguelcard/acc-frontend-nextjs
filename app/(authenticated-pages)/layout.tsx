import { BottomNavigationLayout } from "@/components/shared/BottomNavigationLayout/bottom-navigation-layout";
import { BlurredBlobBackground } from "@/components/shared/BlurredBlobBackground/blurred-blob-background";
import Box from "@mui/material/Box";

export default function AuthenticatedLayout({children,}: {children: React.ReactNode;}) {
    return (
        <>
            <Box
                sx={{
                    bgcolor: '#f5f5f5',
                    minHeight: '100vh',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <BlurredBlobBackground />
                <BottomNavigationLayout>
                    {children}
                </BottomNavigationLayout>
            </Box>
        </>
    );
}