import { Paper, PaperProps, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTaskCreationContext } from './TaskCreation';
import React from 'react';
import {
  WBBox,
  WBFlex,
  WBFullScreenModal,
  WBLink,
  WBSvgIcon,
  WBTypography,
} from '@admiin-com/ds-web';
import UploadIcon from '../../../assets/icons/upload.svg';
import PageSelector from '../../components/PageSelector/PageSelector';
import { BillCreateForm } from '../BillCreateForm/BillCreateForm';
import { BillSign } from '../BillSign/BillSign';
import { BillSummary } from '../BillSummary/BillSummary';
import BillDirection from '../BillDirection/BillDirection';
import { useFormContext } from 'react-hook-form';
import { styled } from '@mui/material';

interface PaperComponentProps extends PaperProps {
  gradient?: boolean;
}
const PaperComponent = React.forwardRef<HTMLDivElement, PaperComponentProps>(
  ({ gradient = false, children, ...props }, ref) => {
    const gradientStyle = gradient
      ? {
          background:
            'linear-gradient(to bottom, rgba(140, 81, 255, 0.7) 0%, transparent 50%)',
        }
      : {};

    return (
      <Paper ref={ref} {...props}>
        <WBBox sx={gradientStyle}>{children}</WBBox>
      </Paper>
    );
  }
);

// To hide content padding
const StyledFullScreenModal = styled(WBFullScreenModal, {
  shouldForwardProp: (prop) => prop !== 'isSignFieldMobile',
})<any>(({ theme, isSignFieldMobile }) => ({
  '& .MuiDialogContent-root': {
    padding: isSignFieldMobile ? theme.spacing(0) : '',
    overflowX: isSignFieldMobile ? 'hidden' : '',
  },

  '& .MuiContainer-root': {
    padding: isSignFieldMobile ? theme.spacing(0) : '',
  },
}));
export function TaskCreationModal() {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const context = useTaskCreationContext();

  const { reset } = useFormContext();

  const {
    handleClose,
    setShowUpload,
    setPage,
    open,
    prevPage,
    page,
    showSignFields,
  } = context ?? {};
  const handlePrev = React.useCallback(() => {
    if (prevPage === null) handleClose();
    else {
      if (prevPage === 'Direction') {
        reset();
      }
      setPage(prevPage);
    }
  }, [handleClose, prevPage, reset, setPage]);

  const modalProps = React.useMemo(() => {
    if (page === 'Add')
      return {
        title: t('addBillOrDocument', { ns: 'taskbox' }),
        leftToolbarIconTitle: t('back', { ns: 'contacts' }),
        leftToolbarIconProps: {
          onClick: handlePrev,
        },
        rightToolbarIcon:
          isMobile && page === 'Add' ? (
            <WBLink
              underline="always"
              alignContent={'center'}
              display={'flex'}
              variant="body2"
              fontWeight={'bold'}
              component={'button'}
              color={'text.primary'}
              sx={{ alignItems: 'center' }}
              onClick={() => {
                setShowUpload((value: boolean) => !value);
              }}
            >
              <WBFlex
                textAlign={'center'}
                alignItems={'center'}
                justifyContent={'center'}
                mr={1}
              >
                <WBSvgIcon
                  fontSize="small"
                  sx={{ fontSize: 14 }}
                  viewBox="0 0 14 14"
                  color={theme.palette.text.primary}
                >
                  <UploadIcon />
                </WBSvgIcon>
              </WBFlex>

              <WBTypography variant="inherit">
                {t('billActions', { ns: 'taskbox' })}
              </WBTypography>
            </WBLink>
          ) : undefined,
      };
    else if (page === 'Sign') {
      return {
        title: t('signers', { ns: 'taskbox' }),
        leftToolbarIconTitle: t('sendForSignature', { ns: 'taskbox' }),
        leftToolbarIconProps: {
          onClick: handlePrev,
        },
      };
    } else if (page === 'Direction') {
      return {
        title: t('addBillOrDocument', { ns: 'taskbox' }),
        leftToolbarIconTitle: t('back', { ns: 'contacts' }),
        leftToolbarIconProps: {
          onClick: handlePrev,
        },
      };
    } else
      return {
        title: t('summary', { ns: 'taskbox' }),
        leftToolbarIconTitle: t('signers', { ns: 'taskbox' }),
        leftToolbarIconProps: {
          onClick: handlePrev,
        },
        sx:
          page === 'Summary'
            ? {
                background:
                  'linear-gradient(to bottom, rgba(140, 81, 255, 0.7) 0%, transparent 25%)',
              }
            : {},
      };
  }, [handlePrev, isMobile, page, setShowUpload, t, theme.palette]);

  return (
    <StyledFullScreenModal
      onClose={handleClose}
      isMobileResponsive={page === 'Add'}
      isSignFieldMobile={showSignFields}
      open={open}
      {...modalProps}
      PaperComponent={PaperComponent}
      hideToolbar={showSignFields}
      PaperProps={{ gradient: page === 'Summary' }}
    >
      <PageSelector current={page}>
        <PageSelector.Page value={'Direction'}>
          <BillDirection />
        </PageSelector.Page>
        <PageSelector.Page value={'Add'}>
          <BillCreateForm />
        </PageSelector.Page>
        <PageSelector.Page value={'Sign'}>
          <BillSign />
        </PageSelector.Page>
        <PageSelector.Page value={'Summary'}>
          <BillSummary />
        </PageSelector.Page>
      </PageSelector>
    </StyledFullScreenModal>
  );
}
