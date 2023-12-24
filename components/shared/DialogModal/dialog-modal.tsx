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
        <DialogTitle sx={{ m: 0, p: 2 }} textAlign="center">
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
        {childrenBody ?
          <DialogContent sx={{ px: 4 }}>
            <BodyWrapper childrenBody={childrenBody} step={step} setStep={setStep} handleCloseDialog={handleClose} />
          </DialogContent>
          : null}
      </Dialog>
    </div>
  );
}


/**
 * Helper function to add the step and setStep properties to the children components only if they accept these props
 * @returns the child component with the added props if needed
 */
function BodyWrapper({ childrenBody, step, setStep, handleCloseDialog }: any) {

  if (!React.isValidElement(childrenBody)) {
    return childrenBody;
  }

  const childrenBodyWithStepProps = React.cloneElement(childrenBody as React.ReactElement<any>, { step: step, setStep: setStep });
  const childrenBodyWithHandleCloseProps = React.cloneElement(childrenBodyWithStepProps as React.ReactElement<any>, { handleCloseDialog: handleCloseDialog });
  // TODO if we pass a component which does not have the step and setStep props,
  // we get a warning in the console for trying to assign them
  return childrenBodyWithHandleCloseProps;
}