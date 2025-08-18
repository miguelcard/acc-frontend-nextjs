'use client';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


type SnackbarProps = {
    text: string;
    isOpen: boolean;
    handleCloseToast: () => void;
}

export const CustomSnackbar = ({ text, isOpen, handleCloseToast}: SnackbarProps) => {

    return (
        <Snackbar
            open={isOpen}
            autoHideDuration={7000}
            onClose={handleCloseToast}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ pt: 2 }}
        >
            <Alert onClose={handleCloseToast} severity="success" sx={{ width: '100%', py: 3, fontWeight: 600 }}>
                {text}
            </Alert>
        </Snackbar>
    );
}