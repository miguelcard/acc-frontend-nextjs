import DialogModal from "@/components/shared/DialogModal/dialog-modal";
import CreateSpaceForm from "./create-space-form";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddIcon from '@mui/icons-material/Add';
import GroupsIcon from '@mui/icons-material/Groups';
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
            sx={{ py: 1, mb: 4 }}
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
                <img
                    src={planet.src ?? planet}
                    width={120}
                    alt="logo"
                    style={{ height: 'auto' }}
                />
                <Typography fontWeight={600} fontSize='1em' pb={2}>
                    Create new Space
                </Typography>
            </Box>
        </>
    )
}