import Box from "@mui/material/Box";

interface ContentCardPorps {
    hidden? : boolean;
    sx?: any;
    children?: React.ReactNode;
}

export default function ContentCard({ hidden = false, sx = {}, children }: ContentCardPorps) {
    return (
        <Box
            hidden={hidden}
            sx={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                ...(sx),
            }}
            width={'100%'}
            flexGrow={1}
            maxHeight={{ sm: '70vh' }}
            overflow={'auto'}
            borderRadius={'1rem'}
            boxShadow={'0 8px 32px 0 rgba(31, 38, 135, 0.15)'}
            border={'1px solid rgba(255, 255, 255, 0.6)'}
            bgcolor={'rgba(255, 255, 255, 0.45)'}
            position={"relative"}
        >
            {children}
        </Box>
    )
}
