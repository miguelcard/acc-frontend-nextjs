'use client';
import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { JSXElementConstructor, ReactElement } from 'react';

interface DialogModalProps {
  button: ReactElement<any, string | JSXElementConstructor<any>>;
  childrenTitle: React.ReactNode;
  childrenBody: React.ReactNode;
}

export default function DialogModal({button, childrenTitle, childrenBody }: DialogModalProps) {

  const [open, setOpen] = React.useState<boolean>(false);
  // we need this state here only for the Back arrow button in the Modal in case of multi step forms
  const [step, setStep] = React.useState<number>(0);

  const handleClickOpen = () => {
    setOpen(true);
    setStep(0);
  };
  const handleClose = () => {
    setOpen(false);
    setStep(0);
  };

  return (
    <div>
      {/* add onClick property to the button we passed as props */}
      {React.cloneElement(button, { onClick: handleClickOpen })}
      <Dialog
        onClose={handleClose}
        open={open}
        fullWidth
        maxWidth='sm'
      >
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
        <DialogTitle sx={{ m: 0, p: 2 }} >
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
        <DialogContent sx={{ px: 4 }}>
          <BodyWrapper childrenBody={childrenBody} step={step} setStep={setStep} />
        </DialogContent>
      </Dialog>
    </div>
  );
}


/**
 * Helper function to add the step and setStep properties to the children components only if they accept these props
 * @returns the child component with the added props if needed
 */
function BodyWrapper({childrenBody, step, setStep }: any ) {
    const childrenBodyWithProps=React.cloneElement(childrenBody,{step: step, setStep: setStep });
    // TODO if we pass a component which does not have the step and setStep props,
    // we get a warning in the console for trying to assign them
    return childrenBodyWithProps;
}