import {
  WBDialog,
  WBDialogContent,
  WBIcon,
  WBIconButton,
} from '@admiin-com/ds-web';
import { styled } from '@mui/material';
import { BusinessProcessProvider } from '../../components/OnboardingContainer/OnboadringContainer';
import OnboardingBusiness from '../OnboardingBusiness/OnboardingBusiness';
import { Entity } from '@admiin-com/ds-graphql';

interface EntityCreateModalProps {
  onSuccess?: (contact: Entity) => void;
  open: boolean;
  handleCloseModal: () => void;
}

export type PageType = 'Upload' | 'Map';
const StyledDialog = styled(WBDialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
export function EntityCreateModal({
  open,
  handleCloseModal,
}: EntityCreateModalProps) {
  return (
    <StyledDialog
      onClose={handleCloseModal}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullScreen
    >
      <WBIconButton
        aria-label="close"
        onClick={handleCloseModal}
        sx={{
          position: 'absolute',
          right: {
            xs: 0,
            sm: 45,
          },
          top: 60,
          color: (theme) => theme.palette.grey[500],
          zIndex: 1200,
        }}
      >
        <WBIcon name="Close" />
      </WBIconButton>
      <WBDialogContent dividers>
        <BusinessProcessProvider
          isDialog={true}
          onFinal={() => {
            handleCloseModal();
          }}
        >
          <OnboardingBusiness />
        </BusinessProcessProvider>
      </WBDialogContent>
    </StyledDialog>
  );
}
