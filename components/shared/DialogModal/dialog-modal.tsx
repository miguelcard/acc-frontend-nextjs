'use client';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { JSXElementConstructor, ReactElement } from 'react';

/**
 * This is a reusable Modal that we use to show things and embed forms within the modal
 */
interface DialogModalProps {
    button: ReactElement<any, string | JSXElementConstructor<any>>;
    childrenTitle?: React.ReactNode;
    childrenBody?: React.ReactNode;
}

export default function DialogModal({ button, childrenTitle, childrenBody }: DialogModalProps) {
    const [open, setOpen] = React.useState<boolean>(false);
    // we need this state here only for the Back arrow button in the Modal in case of multi step forms
    const [step, setStep] = React.useState<number>(0);

    const handleClickOpen = (event: React.MouseEvent<HTMLElement>) => {
        // invoke original button onClick method first if it exists
        if (button.props.onClick) {
            button.props.onClick(event);
        }
        setOpen(true);
        setStep(0);
    };

    const handleClose = () => {
        setOpen(false);
        setStep(0);
    };

    return (
        <>
            {/* add onClick property to the button we passed as props */}
            {React.cloneElement(button, { onClick: handleClickOpen })}
            <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
                {step > 0 ? (
                    <IconButton
                        aria-label="back"
                        onClick={() => setStep((s) => s - 1)}
                        sx={{
                            position: 'absolute',
                            left: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                ) : null}
                <DialogTitle sx={{ m: 0, pt: 2 }} textAlign="center">
                    {childrenTitle}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                {childrenBody ? (
                    <DialogContent sx={{ px: 4 }}>
                        <BodyWrapper childrenBody={childrenBody} step={step} setStep={setStep} handleCloseDialog={handleClose} />
                    </DialogContent>
                ) : null}
            </Dialog>
        </>
    );
}

/**
 * Helper function to add the step, setStep and handleCloseDialog properties to the children components only if they accept these props
 * @returns the child component with the added props if needed
 */
function BodyWrapper({ childrenBody, step, setStep, handleCloseDialog }: any) {
    if (!React.isValidElement(childrenBody)) {
        return childrenBody;
    }

    // Determine if the child is a DOM element (e.g., `<div>`) or a React component
    const isDOMElement: boolean = typeof childrenBody.type === 'string';

    // Props to conditionally inject (only for React components, not DOM elements)
    const propsToInject: Record<string, any> = {};
    if (!isDOMElement) {
        // Inject custom props only if the child is a React component
        propsToInject.step = step;
        propsToInject.setStep = setStep;
        propsToInject.handleCloseDialog = handleCloseDialog;
    }

    return React.cloneElement(childrenBody, propsToInject);
}