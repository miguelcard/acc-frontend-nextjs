
import { ArrowBack } from "@mui/icons-material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Link from "next/link";


interface Props {
    text: string;
    backButtonPath: string;
    sx?: any;
}

export function BackButtonBarWithText({ text, backButtonPath, sx = {} }: Props) {
    return (
        <Box
            position="relative"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
                px: 1, py: 2,
                minWidth: 0,
                width: '100%',
            }}
        >

            {/* Back button box */}
            <Box position="absolute" left={0}>
                <Link href={'/' + backButtonPath}>
                    <IconButton
                        aria-label="back" size="small">
                        <ArrowBack />
                    </IconButton>
                </Link>
            </Box>
            {/* Text Box */}
            <Box sx={{
                margin: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                minWidth: 0,
                mx: 1,
            }}>
                {/* Text */}
                <Typography
                    sx={{
                        whiteSpace: 'noWrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        '@media (max-width: 600px)': {
                            fontSize: '1.1em',
                        },
                        '@media (max-width: 450px)': {
                            fontSize: '1em',
                        },
                        '@media (max-width: 370px)': {
                            fontSize: '0.9em',
                        },
                        ...sx,
                    }}
                >
                    {text}
                </Typography>
            </Box>
        </Box>
    )
}