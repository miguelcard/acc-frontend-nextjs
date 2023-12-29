import DialogModal from "@/components/shared/DialogModal/dialog-modal";
import CreateSpaceForm from "./create-space-form";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';
import Image from 'next/image';
import planet from '@/public/images/spaces/planet.png';

/**
 * The Modal for creating a Space
 */
export default function CreateSpaceModal() {
    return (
        <>
            <DialogModal button={<NewSpaceButton />}
                childrenTitle={<CreateSpaceDialogTitle />}
                childrenBody={<CreateSpaceForm />}
            />
        </>
    )
}


const NewSpaceButton = () => {
    return (
        <Button variant="outlined" color="secondary"
            startIcon={<><AddIcon /><GroupsIcon /></>}
            sx={{ py: 1 }}
        >
            <Typography fontWeight={600} fontSize={"1.1em"}
            >
                New Space
            </Typography>
        </Button>
    );
}

const CreateSpaceDialogTitle = () => {
    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
            >
                <Image
                    src={planet}
                    width={120}
                    height={0}
                    alt="logo"
                // sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' define something like this to improve future performance on images
                />
                <Typography fontWeight={600} fontSize='1em' pb={2}>
                    Create new Space
                </Typography>
            </Box>
        </>
    )
}