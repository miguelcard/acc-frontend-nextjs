import LandingNavbar from '@/components/landing/LandingNavbar/landing-navbar';
import Box from '@mui/material/Box';

export default function LandingLayout({ children,}: { children: React.ReactNode;}) {
    return (
        <>
            <LandingNavbar />
            {children}
            {/* Below is just a temp solution to extend the color of the above box and add the copyright text - Can be put in the layout! */}
            <Box sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                height: '245px',
                backgroundColor: '#84CEC1'
            }}
            >
                <span
                    style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        marginBottom: 45,
                        textAlign: "center",
                    }}
                >a Miguel Cardenas production <br />
                    AvidHabits &copy; 2025
                </span>
            </Box>
        </>
    );
}