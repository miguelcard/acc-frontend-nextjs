import { BottomNavigationLayout } from "@/components/shared/BottomNavigationLayout/bottom-navigation-layout";
import Box from "@mui/material/Box";
import grey from "@mui/material/colors/grey";

export default function AuthenticatedLayout({children,}: {children: React.ReactNode;}) {
    return (
        <>
            <Box
                sx={{
                    bgcolor: grey[100],
                    minHeight: '100vh'
                }}
            >
                <BottomNavigationLayout>
                    {children}
                </BottomNavigationLayout>
            </Box>
        </>
    );
}