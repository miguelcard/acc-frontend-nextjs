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
                ...(sx),
            }}
            width={'100%'}
            flexGrow={1}
            maxHeight={{ sm: '70vh' }}
            overflow={'auto'}
            borderRadius={'1rem'}
            boxShadow={'0 6px 20px 0 #dbdbe8'}
            border={'1px solid #dbdbe8'}
            bgcolor={'#fff'}
            position={"relative"}
        >
            {children}
        </Box>
    )
}
