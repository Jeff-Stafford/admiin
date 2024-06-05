import { TaskDirection } from '@admiin-com/ds-graphql';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTaskCreationContext } from './TaskCreation';
import { WBBox, WBButton, WBFlex, WBIcon, WBLink } from '@admiin-com/ds-web';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';

export const TaskSubmitButtons = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const context = useTaskCreationContext();
  if (!context) return;
  const {
    loading,
    saved,
    submitted,
    page,
    createError,
    handleSave,
    taskDirection,
  } = context;
  console.log('context: ', context);

  return (
    <WBBox
      mt={{
        xs: 6,
        sm: 10,
        width: '100%',
      }}
    >
      {!saved && !submitted ? (
        <>
          <WBButton
            sx={{
              fontSize: theme.typography.body2.fontSize,
            }}
            // disabled={abnQueryLoading}
            loading={loading}
            fullWidth
            type="submit"
          >
            {page !== 'Summary'
              ? t('continue', { ns: 'taskbox' })
              : taskDirection === TaskDirection.SENDING
              ? t('confirmSend', { ns: 'taskbox' })
              : t('confirmCreate', { ns: 'taskbox' })}
          </WBButton>
          {page !== 'Summary' ? null : (
            <ErrorHandler
              errorMessage={t(createError?.message, { ns: 'errors' })}
            />
          )}

          <WBFlex justifyContent={'center'} width={'100%'} marginTop={3}>
            <WBLink
              variant="body2"
              component={'button'}
              underline="always"
              color={'text.primary'}
              fontWeight={'bold'}
              onClick={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {t('saveForLater', { ns: 'taskbox' })}
            </WBLink>
          </WBFlex>
        </>
      ) : (
        <WBBox
          sx={{
            borderRadius: '50px',
            padding: 2,
            paddingX: 6,
            bgcolor: theme.palette.success.main,
            fontWeight: 'bold',
            textAlign: 'center',
            color: 'common.black',
          }}
        >
          {saved ? (
            t('savedForLater', { ns: 'taskbox' })
          ) : submitted ? (
            <>
              <WBIcon
                name="Checkmark"
                size={'small'}
                color="common.black"
              ></WBIcon>
              {t('billCreated', { ns: 'taskbox' })}
            </>
          ) : null}
        </WBBox>
      )}
    </WBBox>
  );
};
