import { WBBox, WBIcon, WBIconButton, defaultTheme } from '@admiin-com/ds-web';
import { Dialog, useMediaQuery, useTheme } from '@mui/material';
import { BeneficialOwner } from '@admiin-com/ds-graphql';
import React from 'react';

export interface SmartUIDlgProps {
  open: boolean;
  onClose: () => void;
  form?: any;
  owner?: BeneficialOwner;
  mode: 'legacy' | 'oneSdk' | 'react';
}
export const SmartUIDlg = React.forwardRef(
  ({ mode, onClose, open, form }: SmartUIDlgProps, ref) => {
    const theme = useTheme();
    const isDownMd = useMediaQuery(theme.breakpoints.down('md'));

    // React.useEffect(() => {
    //   if (open && form && mode === 'oneSdk') {
    //     console.log('opened', form);
    //     setTimeout(async () => {
    //       if (ref && ref.current) await form.mount(ref.current);
    //     }, 0);
    //     form.on(
    //       'results',
    //       async (applicant: any, documents: any, entityId: any) => {
    //         console.log(applicant);
    //         console.log(documents);
    //         console.log(entityId);

    //         //await oneSdkIndividual.search();
    //         /*const checkResults = oneSdkIndividual.submit({
    //         verify: true
    //       });
    //       console.log(checkResults);*/
    //       }
    //     );
    //   }
    // }, [form, open]);

    // Conditionally render dialogContent based on the open state
    return (
      <Dialog
        fullScreen={isDownMd}
        maxWidth={isDownMd ? undefined : 'lg'}
        onClose={onClose}
        open={open}
        sx={{
          zIndex: 2000,
        }}
        PaperProps={{
          sx: {
            height: isDownMd ? undefined : '80vh',
          },
        }}
        scroll="body"
        fullWidth
        // TransitionComponent={Transition}
      >
        <WBIconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: {
              xs: 0,
              sm: 45,
            },
            top: 60,
            color: (theme) => theme.palette.grey[500],
            bgcolor: (theme) => theme.palette.grey[500],
            zIndex: 4000,
          }}
        >
          <WBIcon name="Close" />
        </WBIconButton>

        <WBBox
          ref={ref}
          style={{ width: '100%', height: '100%', bgcolor: 'common.white' }}
        >
          {mode === 'legacy' && (
            /*@ts-ignore*/
            <ff-onboarding-widget width="AUTO" height="100%" />
          )}
        </WBBox>
      </Dialog>
    );
  }
);
export default SmartUIDlg;
